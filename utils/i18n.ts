
import { Language } from '../types/establishment';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    // Navigation
    home: 'Home',
    map: 'Map',
    list: 'List',
    favorites: 'Favorites',
    chats: 'Chats',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    book: 'Book',
    call: 'Call',
    message: 'Message',
    directions: 'Directions',
    
    // Establishment details
    bookAppointment: 'Book Appointment',
    services: 'Services',
    availableSlots: 'Available Slots',
    openingHours: 'Opening Hours',
    reviews: 'reviews',
    
    // Sorting and filtering
    sortBy: 'Sort by',
    filterBy: 'Filter by',
    distance: 'Distance',
    rating: 'Rating',
    price: 'Price',
    availability: 'Availability',
    
    // Profile and settings
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    city: 'City',
    phone: 'Phone',
    email: 'Email',
    photo: 'Photo',
    language: 'Language',
    theme: 'Theme',
    
    // Establishments
    hairdresser: 'Hairdresser',
    cosmetologist: 'Cosmetologist',
    nail_salon: 'Nail Salon',
    spa: 'Spa',
    barbershop: 'Barbershop',
    
    // Chat
    typeMessage: 'Type a message...',
    sendMessage: 'Send',
    noChats: 'No chats yet',
    startConversation: 'Start a conversation with an establishment',
    
    // Booking
    selectService: 'Select Service',
    selectEmployee: 'Select Employee',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    bookingSummary: 'Booking Summary',
    totalPrice: 'Total Price',
    
    // Employees
    manageEmployees: 'Manage Employees',
    addEmployee: 'Add Employee',
    noEmployees: 'No employees yet',
    employeeName: 'Employee Name',
    employeeRole: 'Role',
    employeeBio: 'Bio',
  },
  uk: {
    // Navigation
    home: 'Головна',
    map: 'Карта',
    list: 'Список',
    favorites: 'Улюблені',
    chats: 'Чати',
    profile: 'Профіль',
    settings: 'Налаштування',
    
    // Common actions
    save: 'Зберегти',
    cancel: 'Скасувати',
    delete: 'Видалити',
    edit: 'Редагувати',
    add: 'Додати',
    book: 'Забронювати',
    call: 'Подзвонити',
    message: 'Повідомлення',
    directions: 'Маршрут',
    
    // Establishment details
    bookAppointment: 'Записатися',
    services: 'Послуги',
    availableSlots: 'Доступні слоти',
    openingHours: 'Години роботи',
    reviews: 'відгуків',
    
    // Sorting and filtering
    sortBy: 'Сортувати за',
    filterBy: 'Фільтрувати за',
    distance: 'Відстань',
    rating: 'Рейтинг',
    price: 'Ціна',
    availability: 'Доступність',
    
    // Profile and settings
    firstName: 'Ім\'я',
    lastName: 'Прізвище',
    age: 'Вік',
    city: 'Місто',
    phone: 'Телефон',
    email: 'Email',
    photo: 'Фото',
    language: 'Мова',
    theme: 'Тема',
    
    // Establishments
    hairdresser: 'Перукарня',
    cosmetologist: 'Косметолог',
    nail_salon: 'Нейл-салон',
    spa: 'СПА',
    barbershop: 'Барбершоп',
    
    // Chat
    typeMessage: 'Введіть повідомлення...',
    sendMessage: 'Надіслати',
    noChats: 'Поки що немає чатів',
    startConversation: 'Почніть розмову із закладом',
    
    // Booking
    selectService: 'Оберіть послугу',
    selectEmployee: 'Оберіть співробітника',
    selectDate: 'Оберіть дату',
    selectTime: 'Оберіть час',
    bookingSummary: 'Підсумок бронювання',
    totalPrice: 'Загальна вартість',
    
    // Employees
    manageEmployees: 'Керування співробітниками',
    addEmployee: 'Додати співробітника',
    noEmployees: 'Поки що немає співробітників',
    employeeName: 'Ім\'я співробітника',
    employeeRole: 'Посада',
    employeeBio: 'Біографія',
  },
  ru: {
    // Navigation
    home: 'Главная',
    map: 'Карта',
    list: 'Список',
    favorites: 'Избранное',
    chats: 'Чаты',
    profile: 'Профиль',
    settings: 'Настройки',
    
    // Common actions
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    add: 'Добавить',
    book: 'Забронировать',
    call: 'Позвонить',
    message: 'Сообщение',
    directions: 'Маршрут',
    
    // Establishment details
    bookAppointment: 'Записаться',
    services: 'Услуги',
    availableSlots: 'Доступные слоты',
    openingHours: 'Часы работы',
    reviews: 'отзывов',
    
    // Sorting and filtering
    sortBy: 'Сортировать по',
    filterBy: 'Фильтровать по',
    distance: 'Расстояние',
    rating: 'Рейтинг',
    price: 'Цена',
    availability: 'Доступность',
    
    // Profile and settings
    firstName: 'Имя',
    lastName: 'Фамилия',
    age: 'Возраст',
    city: 'Город',
    phone: 'Телефон',
    email: 'Email',
    photo: 'Фото',
    language: 'Язык',
    theme: 'Тема',
    
    // Establishments
    hairdresser: 'Парикмахерская',
    cosmetologist: 'Косметолог',
    nail_salon: 'Нейл-салон',
    spa: 'СПА',
    barbershop: 'Барбершоп',
    
    // Chat
    typeMessage: 'Введите сообщение...',
    sendMessage: 'Отправить',
    noChats: 'Пока нет чатов',
    startConversation: 'Начните разговор с заведением',
    
    // Booking
    selectService: 'Выберите услугу',
    selectEmployee: 'Выберите сотрудника',
    selectDate: 'Выберите дату',
    selectTime: 'Выберите время',
    bookingSummary: 'Итоги бронирования',
    totalPrice: 'Общая стоимость',
    
    // Employees
    manageEmployees: 'Управление сотрудниками',
    addEmployee: 'Добавить сотрудника',
    noEmployees: 'Пока нет сотрудников',
    employeeName: 'Имя сотрудника',
    employeeRole: 'Должность',
    employeeBio: 'Биография',
  },
});

// Set the locale once at the beginning of your app
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
i18n.locale = ['en', 'uk', 'ru'].includes(deviceLanguage) ? deviceLanguage : 'en';

// Enable fallbacks if you want `en` to be used when a translation
// is missing from the current locale
i18n.enableFallback = true;

export const setLanguage = (language: Language) => {
  i18n.locale = language;
};

export const t = (key: string, options?: any) => {
  return i18n.t(key, options);
};

export default i18n;
