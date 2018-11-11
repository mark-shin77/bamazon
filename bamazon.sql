drop database if exists bamazonDB;

create database bamazonDB;

use bamazonDB;

CREATE TABLE products
(
    item_id INT NOT NULL
    auto_increment,
    product_name varchar
    (100) not null,
    department_name varchar
    (30) not null,
    price numeric
    (19,2) not null,
    stock_quantity int not null,
    product_sales numeric
    (19,2 ),
    primary key
    (item_id)
);

    insert into products
        (product_name, department_name, price, stock_quantity)
    values
        ("WD-40 Multi-Use Product One Gallon", "Automotive", 14.01, 100),
        ("Chemical Guys MIC_493 Chenille Microfiber Premium Scratch-Free Wash Mitt", "Automotive", 6.99, 120),
        ("Hanes Men's Pullover EcoSmart Fleece Hooded Sweatshirt", "Clothing", 10.94, 150),
        ("adidas Men's Soccer Tiro 17 Training Pants", "Clothing", 26.83, 150),
        ("Nintendo Switch – Neon Red and Neon Blue Joy-Con", "Video Games", 299, 50),
        ("PlayStation 4 Console - 1TB Slim Edition", "Video Games", 340, 50),
        ("Dell Inspiron 2-in-1 Laptop", "Electronics", 869.99, 25),
        ("ASUS VG248QZ 24” Full HD 1080P 144Hz 1ms DP HDMI DVI Esports Gaming Monitor", "Electronics", 200, 25),
        ("Dog Nail Clippers and Trimmer By Boshel", "Pet Supplies", 12.99, 125),
        ("Pet Hair Remover Glove", "Pet Supplies", 6.99, 125);

    CREATE TABLE departments
    (
        department_id INT NOT NULL
        auto_increment,
    department_name varchar
        (100) not null,
    over_head_costs numeric
        (19,2) not null,
    primary key
        (department_id)
);

        insert into departments
            (department_name, over_head_costs)
        values
            ("Automotive", 400),
            ("Clothing", 500),
            ("Video Games", 10000),
            ("Electronics", 7500),
            ("Pet Supplies", 200);

        ALTER USER 'root'@'localhost' IDENTIFIED
        WITH mysql_native_password BY 'amazonPrime';