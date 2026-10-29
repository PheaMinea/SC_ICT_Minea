import sqlalchemy
from sqlalchemy import text, create_engine

engine = create_engine("mysql+pymysql://root:@127.0.0.1:3306/sc_academy")
with engine.connect() as conn:
    sql = """
    CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER NOT NULL AUTO_INCREMENT,
        course_id INTEGER UNSIGNED NOT NULL,
        khmer_name VARCHAR(150) NOT NULL,
        english_name VARCHAR(150) NOT NULL,
        gender ENUM('male','female','other') NOT NULL,
        date_of_birth DATE,
        nationality VARCHAR(100),
        religion VARCHAR(100),
        national_id VARCHAR(100),
        id_issued_date DATE,
        id_expiry_date DATE,
        house_no VARCHAR(50),
        village VARCHAR(100),
        commune VARCHAR(100),
        district VARCHAR(100),
        province VARCHAR(100),
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        occupation VARCHAR(150),
        school_name VARCHAR(255),
        education_level VARCHAR(100),
        preferred_schedule VARCHAR(255),
        how_did_you_know_us VARCHAR(150),
        note TEXT,
        status ENUM('pending','approved','rejected','completed') NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(course_id) REFERENCES courses (id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    conn.execute(text(sql))
    conn.commit()
    print("Created enrollments table successfully.")
