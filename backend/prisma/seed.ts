import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const url = process.env['DATABASE_URL'] || 'file:./prisma/dev.db';
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // --- Categories ---
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Электроника',
        slug: 'elektronika',
        description: 'Смартфоны, ноутбуки, наушники и аксессуары',
        icon: '⚡',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Одежда',
        slug: 'odezhda',
        description: 'Мужская и женская одежда на любой сезон',
        icon: '👕',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Дом и сад',
        slug: 'dom-i-sad',
        description: 'Товары для дома, кухни и садового участка',
        icon: '🏡',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Спорт',
        slug: 'sport',
        description: 'Спортивный инвентарь, одежда и питание',
        icon: '⚽',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Книги',
        slug: 'knigi',
        description: 'Художественная и деловая литература',
        icon: '📚',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // --- Products ---
  const productsData = [
    // Electronics
    { name: 'Смартфон Galaxy S25', slug: 'galaxy-s25', description: 'Флагманский смартфон с 256ГБ памяти, AMOLED экран 6.8", 108МП камера', price: 89990, stock: 25, categoryIndex: 0 },
    { name: 'Ноутбук UltraBook Pro 16', slug: 'ultrabook-pro-16', description: 'Ноутбук для работы и творчества, 16" 2.5K, Intel Core i7, 16ГБ RAM, 512ГБ SSD', price: 124990, stock: 10, categoryIndex: 0 },
    { name: 'Наушники AirPods Pro 2', slug: 'airpods-pro-2', description: 'Беспроводные наушники с активным шумоподавлением и пространственным аудио', price: 24990, stock: 50, categoryIndex: 0 },
    { name: 'Умные часы Watch Ultra', slug: 'watch-ultra', description: 'Защищённые умные часы с GPS, пульсометром и автономностью до 7 дней', price: 59990, stock: 15, categoryIndex: 0 },
    { name: 'Планшет Tab S10', slug: 'tab-s10', description: 'Планшет 11" 120Hz, 8ГБ RAM, 128ГБ, стилус в комплекте', price: 49990, stock: 20, categoryIndex: 0 },

    // Clothing
    { name: 'Куртка зимняя Alpine', slug: 'kurtka-alpine', description: 'Тёплая зимняя куртка с мембраной, ветрозащита, утеплитель - пух', price: 15990, stock: 30, categoryIndex: 1 },
    { name: 'Футболка хлопковая Premium', slug: 'futbolka-premium', description: 'Классическая хлопковая футболка, 100% хлопок, доступна в 5 цветах', price: 2490, stock: 200, categoryIndex: 1 },
    { name: 'Джинсы Classic Fit', slug: 'dzhinsy-classic', description: 'Классические джинсы из плотного денима, прямой крой', price: 5990, stock: 75, categoryIndex: 1 },
    { name: 'Кроссовки Urban Runner', slug: 'krossovki-urban', description: 'Повседневные кроссовки с амортизационной подошвой', price: 8990, stock: 45, categoryIndex: 1 },
    { name: 'Пальто шерстяное', slug: 'palto-sherstyanoe', description: 'Элегантное пальто из шерсти кашемир, двубортное', price: 24990, stock: 15, categoryIndex: 1 },

    // Home & Garden
    { name: 'Набор кухонных ножей', slug: 'nozhi-kuhonnye', description: 'Набор из 6 профессиональных ножей из нержавеющей стали', price: 4990, stock: 40, categoryIndex: 2 },
    { name: 'Кашпо для цветов Large', slug: 'kashpo-large', description: 'Керамическое кашпо 30см, подходит для крупных комнатных растений', price: 2490, stock: 60, categoryIndex: 2 },
    { name: 'Садовый стульчик складной', slug: 'sadovy-stul', description: 'Алюминиевый складной стул с текстильным сиденьем', price: 1990, stock: 100, categoryIndex: 2 },
    { name: 'Светодиодная лента RGB', slug: 'led-lenta-rgb', description: 'Светодиодная лента 5м с пультом, 16 цветов, 4 режима', price: 1290, stock: 150, categoryIndex: 2 },
    { name: 'Постельное бельё Сатин', slug: 'postelnoe-satin', description: 'Постельное бельё из сатина 100% хлопок, комплект 2 спальный', price: 3990, stock: 35, categoryIndex: 2 },

    // Sports
    { name: 'Гантели разборные 20кг', slug: 'ganteli-20kg', description: 'Разборные гантели с блинами, хром, удобная рукоятка', price: 7990, stock: 20, categoryIndex: 3 },
    { name: 'Коврик для йоги Premium', slug: 'kovrik-yoga', description: 'Коврик для йоги 6мм, экологичный TPE, нескользящий', price: 2990, stock: 80, categoryIndex: 3 },
    { name: 'Велосипед горный XC-300', slug: 'velosiped-xc300', description: 'Горный велосипед, 27.5", 21 скорость, дисковые тормоза', price: 45990, stock: 8, categoryIndex: 3 },
    { name: 'Термобутылка Steel 1л', slug: 'termobutylka-1l', description: 'Термобутылка из нержавеющей стали, сохраняет тепло 12ч', price: 1990, stock: 120, categoryIndex: 3 },
    { name: 'Эспандер грудной', slug: 'espander-grudnoy', description: 'Эспандер с 5 уровнями нагрузки, для мышц груди и рук', price: 890, stock: 200, categoryIndex: 3 },

    // Books
    { name: 'Атомные привычки', slug: 'atomnye-privychki', description: 'Джеймс Клир — бестселлер о формировании полезных привычек', price: 790, stock: 90, categoryIndex: 4 },
    { name: '1984', slug: 'kniga-1984', description: 'Джордж Оруэлл — культовая антиутопия', price: 490, stock: 120, categoryIndex: 4 },
    { name: 'Думай медленно, решай быстро', slug: 'dumai-medlenno', description: 'Даниэль Канеман — книга по психологии мышления, нобелевский лауреат', price: 990, stock: 60, categoryIndex: 4 },
    { name: 'Мастер и Маргарита', slug: 'master-i-margarita', description: 'Михаил Булгаков — бессмертный роман в твёрдой обложке', price: 590, stock: 75, categoryIndex: 4 },
    { name: 'Sapiens. Краткая история человечества', slug: 'sapiens', description: 'Юваль Ной Харари — как человечество стало доминирующим видом', price: 890, stock: 55, categoryIndex: 4 },
  ];

  const products = await Promise.all(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          stock: p.stock,
          images: JSON.stringify([`/images/${p.slug}.svg`]),
          categoryId: categories[p.categoryIndex].id,
        },
      }),
    ),
  );

  console.log(`Created ${products.length} products`);

  // --- Orders ---
  const ordersData = [
    {
      customerName: 'Иван Петров',
      customerEmail: 'ivan@example.com',
      phone: '+7 (912) 345-67-89',
      address: 'г. Москва, ул. Тверская, д. 12, кв. 45',
      status: 'delivered',
      items: [
        { productIndex: 0, quantity: 1 }, // Galaxy S25
        { productIndex: 3, quantity: 1 }, // Наушники AirPods Pro 2
      ],
    },
    {
      customerName: 'Анна Смирнова',
      customerEmail: 'anna@example.com',
      phone: '+7 (915) 123-45-67',
      address: 'г. Санкт-Петербург, Невский пр., д. 25, кв. 10',
      status: 'shipped',
      items: [
        { productIndex: 6, quantity: 2 },  // Футболки
        { productIndex: 8, quantity: 1 },  // Кроссовки
      ],
    },
    {
      customerName: 'Сергей Кузнецов',
      customerEmail: 'sergey@example.com',
      phone: '+7 (903) 555-66-77',
      address: 'г. Екатеринбург, ул. Ленина, д. 5, кв. 120',
      status: 'pending',
      items: [
        { productIndex: 20, quantity: 2 }, // Атомные привычки
        { productIndex: 23, quantity: 1 }, // Мастер и Маргарита
        { productIndex: 24, quantity: 1 }, // Sapiens
      ],
    },
    {
      customerName: 'Елена Попова',
      customerEmail: 'elena@example.com',
      phone: '+7 (926) 777-88-99',
      address: 'г. Новосибирск, ул. Советская, д. 8, кв. 34',
      status: 'processing',
      items: [
        { productIndex: 10, quantity: 1 }, // Ножи кухонные
        { productIndex: 14, quantity: 2 }, // Постельное бельё
        { productIndex: 11, quantity: 3 }, // Кашпо
      ],
    },
    {
      customerName: 'Дмитрий Волков',
      customerEmail: 'dmitry@example.com',
      phone: '+7 (911) 222-33-44',
      address: 'г. Казань, ул. Баумана, д. 15, кв. 7',
      status: 'delivered',
      items: [
        { productIndex: 1, quantity: 1 },   // UltraBook Pro 16
        { productIndex: 15, quantity: 1 },  // Гантели
        { productIndex: 18, quantity: 1 },  // Термобутылка
      ],
    },
  ];

  for (const orderData of ordersData) {
    const total = orderData.items.reduce((sum, item) => {
      const product = products[item.productIndex];
      return sum + product.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        phone: orderData.phone,
        address: orderData.address,
        total,
        status: orderData.status,
        items: {
          create: orderData.items.map((item) => ({
            productId: products[item.productIndex].id,
            quantity: item.quantity,
            price: products[item.productIndex].price,
          })),
        },
      },
    });

    console.log(`  Created order #${order.id} — ${order.customerName}`);
  }

  // --- Reviews ---
  const reviewsData = [
    { productIndex: 0, rating: 5, comment: 'Отличный смартфон! Камера впечатляет, экран шикарный. Батареи хватает на 2 дня.', author: 'Иван' },
    { productIndex: 0, rating: 4, comment: 'Хороший телефон, но дороговат. За эти деньги ожидал блок питания в комплекте.', author: 'Мария' },
    { productIndex: 1, rating: 5, comment: 'Ноутбук просто зверь! Справляется с любыми задачами. Рекомендую!', author: 'Алексей' },
    { productIndex: 2, rating: 5, comment: 'Лучшие наушники, которые у меня были. Шумоподавление на высоте.', author: 'Екатерина' },
    { productIndex: 2, rating: 4, comment: 'Качество звука отличное, но цена кусается. Брал по акции — норм.', author: 'Павел' },
    { productIndex: 5, rating: 5, comment: 'Куртка супер! В -30 проверено, тепло и комфортно.', author: 'Олег' },
    { productIndex: 6, rating: 4, comment: 'Хорошая футболка, после стирки не садится, цвет не теряет.', author: 'Анна' },
    { productIndex: 7, rating: 5, comment: 'Джинсы сели идеально! Буду заказывать ещё.', author: 'Дмитрий' },
    { productIndex: 10, rating: 5, comment: 'Ножи острые, в руках лежат отлично. Классный набор!', author: 'Сергей' },
    { productIndex: 13, rating: 4, comment: 'Лента яркая, управление удобное. Длины 5м хватает на комнату.', author: 'Виктория' },
    { productIndex: 15, rating: 4, comment: 'Гантели добротные, блины покрыты резиной — не пахнут.', author: 'Максим' },
    { productIndex: 16, rating: 5, comment: 'Отличный коврик, не скользит, удобно заниматься йогой.', author: 'Алиса' },
    { productIndex: 20, rating: 5, comment: 'Книга изменила мой подход к делам. Очень полезно!', author: 'Константин' },
    { productIndex: 21, rating: 5, comment: 'Классика на все времена. Отличное издание.', author: 'Ольга' },
    { productIndex: 23, rating: 4, comment: 'Прекрасное издание, твёрдый переплёт, крупный шрифт.', author: 'Наталья' },
  ];

  for (const reviewData of reviewsData) {
    await prisma.review.create({
      data: {
        productId: products[reviewData.productIndex].id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        author: reviewData.author,
      },
    });
  }

  console.log(`Created ${reviewsData.length} reviews`);

  // Summary
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const reviewCount = await prisma.review.count();

  console.log('\n=== Seed Summary ===');
  console.log(`Categories: ${categories.length}`);
  console.log(`Products:   ${productCount}`);
  console.log(`Orders:     ${orderCount}`);
  console.log(`Reviews:    ${reviewCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
