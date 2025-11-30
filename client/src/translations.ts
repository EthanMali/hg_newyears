export type Language = 'en' | 'ru'

export interface Translations {
  title: string
  subtitle: string
  coupleName: string
  coupleNamePlaceholder: string
  phone: string
  phonePlaceholder: string
  numberOfKids: string
  registerButton: string
  registering: string
  successMessage: string
  errors: {
    coupleNameRequired: string
    phoneRequired: string
    phoneInvalid: string
    kidsNegative: string
    registrationFailed: string
    networkError: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    title: "New Year's Party Registration",
    subtitle: "Join us for a night of celebration",
    coupleName: "Name of Couple Attending",
    coupleNamePlaceholder: "e.g., John & Jane Smith",
    phone: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    numberOfKids: "Number of Kids Coming",
    registerButton: "Register for Party",
    registering: "Registering...",
    successMessage: "Registration successful! We can't wait to celebrate with you!",
    errors: {
      coupleNameRequired: "Couple name is required",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Please enter a valid phone number",
      kidsNegative: "Number of kids cannot be negative",
      registrationFailed: "Registration failed. Please try again.",
      networkError: "Network error. Please check if the server is running."
    }
  },
  ru: {
    title: "Регистрация на Новогоднюю Вечеринку",
    subtitle: "Присоединяйтесь к нам на ночь празднования",
    coupleName: "Имя пары",
    coupleNamePlaceholder: "например, Иван & Мария Ивановы",
    phone: "Номер телефона",
    phonePlaceholder: "Введите ваш номер телефона",
    numberOfKids: "Количество детей",
    registerButton: "Зарегистрироваться на вечеринку",
    registering: "Регистрация...",
    successMessage: "Регистрация успешна! Мы с нетерпением ждем празднования с вами!",
    errors: {
      coupleNameRequired: "Имя пары обязательно",
      phoneRequired: "Номер телефона обязателен",
      phoneInvalid: "Пожалуйста, введите действительный номер телефона",
      kidsNegative: "Количество детей не может быть отрицательным",
      registrationFailed: "Регистрация не удалась. Пожалуйста, попробуйте снова.",
      networkError: "Ошибка сети. Пожалуйста, проверьте, запущен ли сервер."
    }
  }
}

