"""
SC Academy Security & Threat Shield
Comprehensive protection against automated spam bots, malicious payloads, XSS, SQLi, and hacker attacks.
"""

import re
import html
from typing import Tuple, Optional
import logging

logger = logging.getLogger("security_shield")

# =========================================================
# ATTACK & MALICIOUS PATTERNS (REGEX SIGNATURES)
# =========================================================

# 1. Cross-Site Scripting (XSS) & Dangerous Scripting Injection
XSS_PATTERNS = [
    re.compile(r"<\s*script[^>]*>", re.IGNORECASE),
    re.compile(r"<\s*/\s*script\s*>", re.IGNORECASE),
    re.compile(r"javascript\s*:", re.IGNORECASE),
    re.compile(r"vbscript\s*:", re.IGNORECASE),
    re.compile(r"data\s*:\s*text/html", re.IGNORECASE),
    re.compile(r"<\s*iframe[^>]*>", re.IGNORECASE),
    re.compile(r"<\s*object[^>]*>", re.IGNORECASE),
    re.compile(r"<\s*embed[^>]*>", re.IGNORECASE),
    re.compile(r"on(load|error|click|mouseover|mouseenter|focus|blur|change|submit)\s*=", re.IGNORECASE),
    re.compile(r"<\s*svg[^>]*onload\s*=", re.IGNORECASE),
    re.compile(r"<\s*img[^>]*onerror\s*=", re.IGNORECASE),
    re.compile(r"alert\s*\(", re.IGNORECASE),
    re.compile(r"eval\s*\(", re.IGNORECASE),
    re.compile(r"document\.cookie", re.IGNORECASE),
]

# 2. SQL Injection (SQLi) Signatures
SQLI_PATTERNS = [
    re.compile(r"(\%27)|(\')|(\-\-)|(\%23)|(#)", re.IGNORECASE),
    re.compile(r"\b(UNION(\s+ALL)?\s+SELECT)\b", re.IGNORECASE),
    re.compile(r"\b(INSERT\s+INTO|DELETE\s+FROM|DROP\s+TABLE|DROP\s+DATABASE|ALTER\s+TABLE)\b", re.IGNORECASE),
    re.compile(r"\b(SELECT\s+.*\s+FROM\s+.*WHERE)\b", re.IGNORECASE),
    re.compile(r"\b(OR\s+['\"0-9a-zA-Z]+\s*=\s*['\"0-9a-zA-Z]+)\b", re.IGNORECASE),
    re.compile(r"\b(AND\s+['\"0-9a-zA-Z]+\s*=\s*['\"0-9a-zA-Z]+)\b", re.IGNORECASE),
    re.compile(r"\b(INFORMATION_SCHEMA|xp_cmdshell|WAITFOR\s+DELAY)\b", re.IGNORECASE),
    re.compile(r";\s*SHUTDOWN", re.IGNORECASE),
]

# 3. Remote Code Execution / System Command Injection
CMD_INJECTION_PATTERNS = [
    re.compile(r"\b(cmd\.exe|powershell(\.exe)?|/bin/sh|/bin/bash)\b", re.IGNORECASE),
    re.compile(r"\b(wget\s+http|curl\s+http|nc\s+-e|bash\s+-i)\b", re.IGNORECASE),
    re.compile(r"\b(cat\s+/etc/passwd|type\s+C:\\)\b", re.IGNORECASE),
]

# 4. Path Traversal
PATH_TRAVERSAL_PATTERNS = [
    re.compile(r"(\.\./\.\./|\.\.\\\.\.\\|/etc/shadow|/etc/passwd|C:\\Windows\\System32)", re.IGNORECASE),
]

# 5. Excessive URLs / Link Spam Pattern
URL_PATTERN = re.compile(
    r"(https?://|www\.)[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+,;=%]+",
    re.IGNORECASE
)

# 6. Known Spambot Keywords
SPAM_KEYWORDS = [
    "viagra", "cialis", "casino", "poker", "slot machine", "free spins",
    "crypto profit", "bitcoin multiplier", "guaranteed returns",
    "make $1000", "seo ranking guarantee", "adult webcam", "dating service",
    "whatsapp investment", "telegram pump"
]


def sanitize_text(text: Optional[str]) -> str:
    """
    Sanitize text by stripping leading/trailing whitespace and HTML-escaping dangerous entities.
    """
    if not text:
        return ""
    # Strip dangerous HTML tags
    cleaned = re.sub(r"<[^>]+>", "", text)
    # Strip null bytes
    cleaned = cleaned.replace("\0", "")
    return cleaned.strip()


def inspect_security(name: str, email: str, phone: Optional[str], subject: Optional[str], message: str) -> Tuple[bool, Optional[str]]:
    """
    Perform deep security analysis across all input fields.
    Returns:
        (is_safe, error_reason)
    """
    combined_content = f"{name} {email} {phone or ''} {subject or ''} {message}"
    
    # 1. Check for XSS
    for pattern in XSS_PATTERNS:
        if pattern.search(combined_content):
            logger.warning(f"Security Alert: XSS attempt detected: {pattern.pattern}")
            return False, "Message rejected: contains forbidden scripting or code injection patterns."

    # 2. Check for SQL Injection
    for pattern in SQLI_PATTERNS:
        if pattern.search(name) or pattern.search(email) or pattern.search(phone or ""):
            logger.warning(f"Security Alert: SQLi pattern detected in header fields: {pattern.pattern}")
            return False, "Message rejected: invalid characters detected."
            
    # Check SQLi in message body (more specific)
    if re.search(r"\b(UNION(\s+ALL)?\s+SELECT|DROP\s+TABLE|xp_cmdshell|INFORMATION_SCHEMA)\b", combined_content, re.IGNORECASE):
        logger.warning("Security Alert: Dangerous SQLi keyword found in message.")
        return False, "Message rejected: dangerous SQL patterns detected."

    # 3. Check for Command Injection
    for pattern in CMD_INJECTION_PATTERNS:
        if pattern.search(combined_content):
            logger.warning(f"Security Alert: Command injection attempt detected: {pattern.pattern}")
            return False, "Message rejected: system execution payloads detected."

    # 4. Check for Path Traversal
    for pattern in PATH_TRAVERSAL_PATTERNS:
        if pattern.search(combined_content):
            logger.warning(f"Security Alert: Path traversal attempt: {pattern.pattern}")
            return False, "Message rejected: invalid path traversal detected."

    # 5. Check Name Validity (Name shouldn't contain URLs or emails or code)
    if URL_PATTERN.search(name) or "@" in name or len(name) > 100:
        logger.warning(f"Spam Alert: Suspicious sender name: {name}")
        return False, "Please enter a valid human name."

    # 6. Link Spambot Flood Check
    urls_found = URL_PATTERN.findall(message)
    if len(urls_found) > 2:
        logger.warning(f"Spam Alert: Excessive link spam detected ({len(urls_found)} URLs)")
        return False, "Message rejected: multiple external links or advertising links are not permitted."

    # 7. Spam Keyword Analysis
    message_lower = message.lower()
    for kw in SPAM_KEYWORDS:
        if kw in message_lower:
            logger.warning(f"Spam Alert: Blacklisted spam keyword '{kw}' detected")
            return False, "Message rejected: promotional or spam content detected."

    # 8. Repetitive Character Spam Check (e.g. aaaaaaaaaaaa...)
    if re.search(r"(.)\1{18,}", message):
        logger.warning("Spam Alert: Repetitive character flood detected")
        return False, "Message rejected: repetitive character flood detected."

    return True, None
