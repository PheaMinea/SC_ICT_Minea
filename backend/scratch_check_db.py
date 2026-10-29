import sqlalchemy
from sqlalchemy import text, create_engine

engine = create_engine("mysql+pymysql://root:@127.0.0.1:3306/sc_academy")
with engine.connect() as conn:
    result = conn.execute(text("SHOW TABLES"))
    tables = [row[0] for row in result.fetchall()]
    for t in tables:
        res = conn.execute(text(f"SHOW CREATE TABLE {t}"))
        print(f"--- {t} ---")
        print(res.fetchone()[1])
