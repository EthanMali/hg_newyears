import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const log = (scope, details = {}, level = 'info') => {
  const timestamp = new Date().toISOString();
  const payload = typeof details === 'string' ? { message: details } : details;
  console[level === 'error' ? 'error' : 'log'](
    JSON.stringify({ timestamp, level, scope, ...payload })
  );
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read users from file
const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      console.log('users.json was corrupted and has been reset to an empty array.');
    } catch (resetError) {
      console.error('Failed to reset users file:', resetError);
    }
    return [];
  }
};

// Helper function to write users to file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// POST /api/register - Create a new registration (New Year's Party)
app.post('/api/register', (req, res) => {
  try {
    const {
      coupleName,
      phone,
      numberOfKids,
      husbandName,
      wifeName,
      lastName,
      amount
    } = req.body;

    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
    const normalizedHusband = typeof husbandName === 'string' ? husbandName.trim() : '';
    const normalizedWife = typeof wifeName === 'string' ? wifeName.trim() : '';
    const normalizedLast = typeof lastName === 'string' ? lastName.trim() : '';

    let normalizedCoupleName = typeof coupleName === 'string' ? coupleName.trim() : '';
    if (!normalizedCoupleName && (normalizedHusband || normalizedWife)) {
      const baseNames = [normalizedHusband, normalizedWife].filter(Boolean).join(' & ');
      normalizedCoupleName = normalizedLast ? `${baseNames} ${normalizedLast}` : baseNames;
    }

    log('register:incoming', {
      coupleName: normalizedCoupleName,
      phone: normalizedPhone,
      numberOfKids,
      husbandName: normalizedHusband,
      wifeName: normalizedWife,
      lastName: normalizedLast,
      amount
    });

    if (!normalizedCoupleName || !normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Couple name and phone are required'
      });
    }

    // Validate numberOfKids
    const kidsCount = parseInt(numberOfKids) || 0;
    if (kidsCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Number of kids cannot be negative'
      });
    }

    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    const defaultAmount = 150 + (kidsCount * 25);
    const normalizedAmount = Number.isFinite(parsedAmount) && parsedAmount >= 0
      ? parsedAmount
      : defaultAmount;

    const users = readUsers();

    // Create new registration
    const newRegistration = {
      id: generateId(),
      coupleName: normalizedCoupleName,
      phone: normalizedPhone,
      numberOfKids: kidsCount,
      amount: normalizedAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (normalizedHusband) newRegistration.husbandName = normalizedHusband;
    if (normalizedWife) newRegistration.wifeName = normalizedWife;
    if (normalizedLast) newRegistration.lastName = normalizedLast;

    users.push(newRegistration);

    if (writeUsers(users)) {
      log('register:success', { id: newRegistration.id, coupleName: newRegistration.coupleName });
      res.status(201).json({
        success: true,
        message: 'Registration successful! See you at the party!',
        registration: {
          id: newRegistration.id,
          coupleName: newRegistration.coupleName,
          phone: newRegistration.phone,
          numberOfKids: newRegistration.numberOfKids,
          createdAt: newRegistration.createdAt
        }
      });
    } else {
      log('register:write_error', { error: 'Failed to save registration' }, 'error');
      res.status(500).json({
        success: false,
        message: 'Failed to save registration'
      });
    }
  } catch (error) {
    log('register:exception', { error: error?.message, stack: error?.stack }, 'error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/users - Get all registrations
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    
    res.json({
      success: true,
      count: users.length,
      totalAdults: users.length * 2, // Each couple = 2 adults
      totalKids: users.reduce((sum, user) => sum + (user.numberOfKids || 0), 0),
      registrations: users
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id - Get a specific registration by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();
    const registration = users.find(u => u.id === id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      registration: registration
    });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/users/:id - Update a registration
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { coupleName, phone, numberOfKids } = req.body;

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update registration fields
    if (coupleName) users[userIndex].coupleName = coupleName;
    if (phone) users[userIndex].phone = phone;
    if (numberOfKids !== undefined) {
      const kidsCount = parseInt(numberOfKids) || 0;
      if (kidsCount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Number of kids cannot be negative'
        });
      }
      users[userIndex].numberOfKids = kidsCount;
    }
    users[userIndex].updatedAt = new Date().toISOString();

    if (writeUsers(users)) {
      res.json({
        success: true,
        message: 'Registration updated successfully',
        registration: users[userIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update registration'
      });
    }
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/users/:id - Delete a registration
app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const deletedRegistration = users.splice(userIndex, 1)[0];

    if (writeUsers(users)) {
      res.json({
        success: true,
        message: 'Registration deleted successfully',
        registration: deletedRegistration
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete registration'
      });
    }
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /api/users/:id - Partial update (alternative to PUT)
app.patch('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Validate numberOfKids if being updated
    if (updates.numberOfKids !== undefined) {
      const kidsCount = parseInt(updates.numberOfKids) || 0;
      if (kidsCount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Number of kids cannot be negative'
        });
      }
      updates.numberOfKids = kidsCount;
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        users[userIndex][key] = updates[key];
      }
    });
    users[userIndex].updatedAt = new Date().toISOString();

    if (writeUsers(users)) {
      res.json({
        success: true,
        message: 'Registration updated successfully',
        registration: users[userIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update registration'
      });
    }
  } catch (error) {
    console.error('Patch registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Registration endpoint: http://localhost:${PORT}/api/register`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users`);
});

