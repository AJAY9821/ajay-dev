import os
from PIL import Image, ImageDraw, ImageFont

# Input directory with original user uploaded screenshots
USER_UPLOAD_DIR = r"C:\Users\ajeys\.gemini\antigravity-ide\brain\b16d4b70-341e-4baa-a97e-5ab0e2e5ffd1\.user_uploaded"
# Output directory in portfolio public projects
OUTPUT_DIR = r"c:\Users\ajeys\OneDrive\Desktop\portfolio\AJAY.DEV\public\projects"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Fonts
FONT_BOLD_14 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 14)
FONT_BOLD_11 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 11)
FONT_BOLD_10 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 10)
FONT_BOLD_9 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 9)
FONT_BOLD_8 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 8)
FONT_REG_11 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 11)
FONT_REG_10 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 10)
FONT_REG_9 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 9)
FONT_REG_8 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 8)

# -------------------------------------------------------------
# 1. PROCESS LOGIN SCREEN (Screenshot 1)
# -------------------------------------------------------------
def process_login():
    print("Processing Login Portal Screenshot...")
    src_path = os.path.join(USER_UPLOAD_DIR, "media_1793255592166.png")
    im = Image.open(src_path).convert("RGB")
    
    # Save as hrms-login.png
    out_path = os.path.join(OUTPUT_DIR, "hrms-login.png")
    im.save(out_path, format="PNG", quality=95)
    print(f"Saved: {out_path}")

# -------------------------------------------------------------
# 2. PROCESS ATTENDANCE HUB (Screenshot 2)
# -------------------------------------------------------------
def process_attendance():
    print("Processing Attendance Hub Screenshot...")
    src_path = os.path.join(USER_UPLOAD_DIR, "media_1793256017487.png")
    im = Image.open(src_path).convert("RGB")
    draw = ImageDraw.Draw(im)

    # A. Clean red marker drawn by user in x: 180..275, y: 75..168
    for y in range(75, 168):
        for x in range(180, 275):
            r, g, b = im.getpixel((x, y))
            # Marker red detection
            if r > 160 and g < 100 and b < 100:
                if y < 109 or x < 190:
                    im.putpixel((x, y), (246, 247, 249))
                elif x == 190 or y == 109:
                    im.putpixel((x, y), (235, 238, 242))
                else:
                    im.putpixel((x, y), (255, 255, 255))

    # B. Re-render 'Live Clock' title cleanly
    draw.rectangle([(224, 124), (275, 137)], fill=(255, 255, 255))
    draw.text((226, 126), "Live Clock", font=FONT_BOLD_11, fill=(30, 41, 59))

    # C. Replace GPS orange button with clean Corporate Punch Clock button
    # Original orange button: x: 202..376, y: 244..269
    draw.rounded_rectangle([(202, 244), (376, 269)], radius=5, fill=(0, 168, 112))
    btn_text = "●  Punch In (Web Portal)"
    btn_bbox = FONT_BOLD_11.getbbox(btn_text)
    btn_w = btn_bbox[2] - btn_bbox[0]
    btn_x = int(289 - btn_w / 2)
    draw.text((btn_x, 250), btn_text, font=FONT_BOLD_11, fill=(255, 255, 255))

    # D. Replace location subtext (Locating... +/-10m | 52+)
    # y: 283..302, x: 195..384
    draw.rectangle([(195, 283), (384, 301)], fill=(246, 247, 249))
    sub_text = "✓  Corporate Network  •  Session Active"
    sub_bbox = FONT_REG_9.getbbox(sub_text)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = int(289 - sub_w / 2)
    draw.text((sub_x, 288), sub_text, font=FONT_REG_9, fill=(100, 116, 139))

    # E. Update AI Policy Guard - sanitize geofence reference
    # Paragraph: x: 413..755, y: 217..237
    draw.rectangle([(413, 217), (755, 237)], fill=(255, 255, 255))
    line1 = "Automated compliance engaging real-time Security perimeter, verified corporate network, and"
    line2 = "authorized device telemetry."
    draw.text((414, 217), line1, font=FONT_REG_9, fill=(100, 116, 139))
    draw.text((414, 227), line2, font=FONT_REG_9, fill=(100, 116, 139))

    # Column 1 in AI Policy Guard: change GEOFENCE / Radius Verified to SECURITY / Policy Verified
    col1_bg = (250, 252, 253)
    draw.rectangle([(405, 256), (490, 274)], fill=col1_bg)
    draw.text((410, 258), "SECURITY", font=FONT_BOLD_8, fill=(148, 163, 184))
    draw.text((410, 266), "● Policy Verified", font=FONT_BOLD_8, fill=(0, 168, 112))

    # F. Update Sidebar user profile: 'tester probey' -> 'Alex Vance' / 'HR ADMIN'
    draw.rectangle([(35, 55), (140, 80)], fill=(255, 255, 255))
    draw.text((36, 57), "Alex Vance", font=FONT_BOLD_11, fill=(30, 41, 59))
    draw.text((36, 70), "HR ADMIN", font=FONT_BOLD_8, fill=(148, 163, 184))

    # G. Update Top-right profile: 'TESTER' -> 'ADMIN'
    top_bar_bg = (46, 108, 162)
    draw.rectangle([(945, 14), (988, 30)], fill=top_bar_bg)
    draw.text((947, 16), "ADMIN", font=FONT_BOLD_10, fill=(255, 255, 255))
    # Draw subtle dropdown caret
    draw.polygon([(982, 22), (986, 22), (984, 25)], fill=(255, 255, 255))

    out_path = os.path.join(OUTPUT_DIR, "hrms-attendance.png")
    im.save(out_path, format="PNG", quality=95)
    print(f"Saved: {out_path}")

# -------------------------------------------------------------
# 3. PROCESS DASHBOARD (Screenshot 3)
# -------------------------------------------------------------
def process_dashboard():
    print("Processing Dashboard Screenshot...")
    src_path = os.path.join(USER_UPLOAD_DIR, "media_1793256195968.png")
    im = Image.open(src_path).convert("RGB")
    draw = ImageDraw.Draw(im)

    # A. Greeting: 'Good Afternoon, tester !' -> 'Good Afternoon, Alex !'
    # Fill background at x: 348..415, y: 58..78
    draw.rectangle([(348, 58), (415, 78)], fill=(241, 243, 245))
    draw.text((349, 62), "Alex !", font=FONT_BOLD_14, fill=(0, 107, 187))

    # B. Celebrations card: 'Nishtha Raj' -> 'Sarah Jenkins' (fake employee name)
    # Background is pure white (255, 255, 255)
    draw.rectangle([(625, 393), (718, 405)], fill=(255, 255, 255))
    draw.text((626, 394), "Sarah Jenkins", font=FONT_BOLD_9, fill=(30, 41, 59))

    # C. Sidebar user profile: 'tester probey' -> 'Alex Vance' / 'HR ADMIN'
    draw.rectangle([(35, 55), (140, 80)], fill=(255, 255, 255))
    draw.text((36, 57), "Alex Vance", font=FONT_BOLD_11, fill=(30, 41, 59))
    draw.text((36, 70), "HR ADMIN", font=FONT_BOLD_8, fill=(148, 163, 184))

    # D. Top-right profile: 'TESTER' -> 'ADMIN'
    top_bar_bg = (44, 109, 165)
    draw.rectangle([(945, 14), (988, 30)], fill=top_bar_bg)
    draw.text((947, 16), "ADMIN", font=FONT_BOLD_10, fill=(255, 255, 255))
    draw.polygon([(982, 22), (986, 22), (984, 25)], fill=(255, 255, 255))

    out_path = os.path.join(OUTPUT_DIR, "hrms-dashboard.png")
    im.save(out_path, format="PNG", quality=95)
    print(f"Saved: {out_path}")

    # Also update hrms-payroll.png/jpg so existing references point to the new high-res sanitized dashboard
    payroll_png = os.path.join(OUTPUT_DIR, "hrms-payroll.png")
    im.save(payroll_png, format="PNG", quality=95)
    print(f"Saved: {payroll_png}")

if __name__ == "__main__":
    process_login()
    process_attendance()
    process_dashboard()
    print("All HRMS screenshots successfully sanitized and saved!")
