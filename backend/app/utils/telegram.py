import hashlib
import hmac
from urllib.parse import parse_qsl
from app.config import settings


def validate_telegram_init_data(init_data: str) -> dict | None:
    """
    Validate Telegram WebApp initData
    Returns parsed user data if valid, None otherwise
    """
    try:
        # Parse initData
        parsed_data = dict(parse_qsl(init_data))

        # Extract hash
        data_check_string_hash = parsed_data.pop("hash", None)
        if not data_check_string_hash:
            return None

        # Create data-check-string
        data_check_arr = [f"{k}={v}" for k, v in sorted(parsed_data.items())]
        data_check_string = "\n".join(data_check_arr)

        # Create secret key
        secret_key = hmac.new(
            key="WebAppData".encode(),
            msg=settings.TELEGRAM_BOT_TOKEN.encode(),
            digestmod=hashlib.sha256
        ).digest()

        # Calculate hash
        calculated_hash = hmac.new(
            key=secret_key,
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()

        # Verify hash
        if calculated_hash != data_check_string_hash:
            return None

        # Parse user data
        import json
        user_data = json.loads(parsed_data.get("user", "{}"))

        return user_data

    except Exception as e:
        print(f"Telegram validation error: {e}")
        return None
