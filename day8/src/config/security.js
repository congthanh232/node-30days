export const helmetOptions = {

    // contentSecurityPolicy: tắt vì đây là API thuần, không serve HTML
    // Nếu có frontend dùng chung server này thì mới bật
    contentSecurityPolicy: false,

    // crossOriginResourcePolicy: cho phép resource được dùng cross-origin
    // Quan trọng nếu serve file upload (ảnh, pdf...)
    contentSecurityPolicy: false,
}


export const corsOptions = {
    // origin: browser từ domain nào được phép gọi API này
    origin:
    process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']  // production → domain thật
    : ['http://localhost:5173',   // dev → Vite (React/Vue)
        'http://localhost:3000'],   // dev → hoặc cùng port


    // methods: browser được dùng HTTP verb nào
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    
    // allowedHeaders: browser được gửi header nào lên server
    allowedHeaders: ['Content-Type', 'Authorization'],

    // credentials: false vì dùng JWT (không dùng cookie)
    credentials: false,
}