<?php
header('Content-Type: application/json; charset=utf-8');

// Настройки (ИЗМЕНИТЕ ЭТИ ДАННЫЕ!)
$to = 'migbelg@yandex.ru'; // Ваш email для получения заявок
$siteName = 'Сайт МИГ'; // Название вашего сайта

// Получаем данные из формы
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Массив для хранения ошибок
$errors = [];

// Валидация данных
if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
} elseif (strlen($name) < 2) {
    $errors[] = 'Имя должно содержать минимум 2 символа';
} elseif (strlen($name) > 50) {
    $errors[] = 'Имя не должно превышать 50 символов';
}

if (empty($phone)) {
    $errors[] = 'Телефон обязателен для заполнения';
} else {
    // Очищаем номер от всего кроме цифр
    $phoneClean = preg_replace('/\D/', '', $phone);

    // Проверяем длину номера (для России 11 цифр с +7)
    if (strlen($phoneClean) < 10 || strlen($phoneClean) > 12) {
        $errors[] = 'Некорректный номер телефона';
    }
}

if (empty($message)) {
    $errors[] = 'Сообщение обязательно для заполнения';
} elseif (strlen($message) < 10) {
    $errors[] = 'Сообщение должно содержать минимум 10 символов';
} elseif (strlen($message) > 1000) {
    $errors[] = 'Сообщение не должно превышать 1000 символов';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode($errors)
    ]);
    exit;
}

// Подготовка заголовков письма
$headers = [
    'From' => "{$siteName} <noreply@{$_SERVER['HTTP_HOST']}>",
    'Reply-To' => "{$name} <noreply@{$_SERVER['HTTP_HOST']}>",
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/html; charset=UTF-8'
];

// Форматируем телефон для красивого отображения
$formattedPhone = formatPhone($phone);

// Формируем тему письма
$emailSubject = "Новая заявка с сайта {$siteName}";

// Формируем тело письма в HTML формате
$emailBody = "Новая заявка с сайта МИГ. Имя: {$name}, Телефон: {$formattedPhone}, Сообщение: {$message}, IP-адрес: {$_SERVER['REMOTE_ADDR']}, Страница отправки: {$_SERVER['HTTP_REFERER']}";

// Преобразуем заголовки в строку
$headersString = '';
foreach ($headers as $key => $value) {
    $headersString .= "$key: $value\r\n";
}

// Пытаемся отправить письмо
if (mail($to, $emailSubject, $emailBody, $headersString)) {
    // Логирование успешной отправки (опционально)
    logMessage([
        'status' => 'success',
        'date' => date('Y-m-d H:i:s'),
        'name' => $name,
        'phone' => $phone,
        'ip' => $_SERVER['REMOTE_ADDR']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
    ]);
} else {
    // Логирование ошибки
    logMessage([
        'status' => 'error',
        'date' => date('Y-m-d H:i:s'),
        'name' => $name,
        'phone' => $phone,
        'ip' => $_SERVER['REMOTE_ADDR'],
        'error' => 'Ошибка отправки mail()'
    ]);

    echo json_encode([
        'success' => false,
        'message' => 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
    ]);
}

// Функция для форматирования телефона
function formatPhone($phone) {
    $phone = preg_replace('/\D/', '', $phone);

    if (strlen($phone) === 11 && $phone[0] === '7') {
        return '+7 (' . substr($phone, 1, 3) . ') ' . substr($phone, 4, 3) . '-' . substr($phone, 7, 2) . '-' . substr($phone, 9, 2);
    }

    return $phone;
}

// Функция для логирования (опционально)
function logMessage($data) {
    $logFile = __DIR__ . '/form_log.txt';
    $logEntry = json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>
