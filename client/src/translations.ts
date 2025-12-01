// Supported languages
export type Language = 'en' | 'ru'

// First, let's update the Translations interface
export interface Translations {
  title: string
  subtitle: string
  husbandName: string
  wifeName: string
  lastName: string
  husbandNamePlaceholder: string
  wifeNamePlaceholder: string
  lastNamePlaceholder: string
  phone: string
  phonePlaceholder: string
  numberOfKids: string
  numberOfKidsTooltip: string
  registerButton: string
  registering: string
  successMessage: string
  continueToPayment: string
  errors: {
    husbandNameRequired: string
    wifeNameRequired: string
    lastNameRequired: string
    phoneRequired: string
    phoneInvalid: string
    kidsNegative: string
    registrationFailed: string
    networkError: string
  }
}

// Then update the translations object
export const translations: Record<Language, Translations> = {
  en: {
    title: 'Registration',
    subtitle: 'Please fill in your details',
    husbandName: "Husband's Name",
    wifeName: "Wife's Name",
    lastName: 'Last Name',
    husbandNamePlaceholder: 'e.g., John',
    wifeNamePlaceholder: 'e.g., Jane',
    lastNamePlaceholder: 'e.g., Smith',
    phone: 'Phone Number',
    phonePlaceholder: '(XXX) XXX-XXXX',
    numberOfKids: 'Number of children coming with you',
    numberOfKidsTooltip: 'How many children will be coming with you',
    registerButton: 'Register',
    registering: 'Registering...',
    successMessage: 'Registration successful!',
    continueToPayment: 'Continue to Payment',
    errors: {
      husbandNameRequired: "Husband's name is required",
      wifeNameRequired: "Wife's name is required",
      lastNameRequired: 'Last name is required',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid phone number',
      kidsNegative: 'Number of kids cannot be negative',
      registrationFailed: 'Registration failed. Please try again.',
      networkError: 'Network error. Please check your connection.'
    }
  },
  ru: {
    title: 'Регистрация',
    subtitle: 'Пожалуйста, заполните ваши данные',
    husbandName: 'Имя мужа',
    wifeName: 'Имя жены',
    lastName: 'Фамилия',
    husbandNamePlaceholder: 'Например, Иван',
    wifeNamePlaceholder: 'Например, Анна',
    lastNamePlaceholder: 'Например, Ивановы',
    phone: 'Телефон',
    phonePlaceholder: 'Введите номер телефона',
    numberOfKids: 'Сколько детей приедет с вами',
    numberOfKidsTooltip: 'Сколько детей придёт с вами',
    registerButton: 'Зарегистрироваться',
    registering: 'Регистрация...',
    successMessage: 'Вы успешно зарегистрировались!',
    continueToPayment: 'Продолжить оплату',
    errors: {
      husbandNameRequired: 'Укажите имя мужа',
      wifeNameRequired: 'Укажите имя жены',
      lastNameRequired: 'Укажите фамилию',
      phoneRequired: 'Укажите номер телефона',
      phoneInvalid: 'Неверный формат номера',
      kidsNegative: 'Количество детей не может быть отрицательным',
      registrationFailed: 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.',
      networkError: 'Ошибка соединения. Проверьте подключение к интернету.'
    }
  }
}