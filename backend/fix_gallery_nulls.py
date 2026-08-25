import sqlite3

def main():
    conn = sqlite3.connect("sc_academy.db")
    cur = conn.cursor()

    cur.execute(
        "UPDATE gallery_images SET image_url = ? WHERE image_url IS NULL OR image_url = ''",
        ("/uploads/placeholder.jpg",),
    )

    conn.commit()
    print("rows_fixed:", cur.rowcount)
    conn.close()

if __name__ == "__main__":
    main()
