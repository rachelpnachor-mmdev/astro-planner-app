import json
import sys
import os
from jsonschema import validate, ValidationError, Draft7Validator

def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read JSON file: {e}")
        sys.exit(1)

def load_schema(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read schema file: {e}")
        sys.exit(1)

def validate_json(data, schema):
    # The 'horoscope' field is optional, so validation will pass if it is missing
    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)
    if errors:
        print("[ERROR] JSON validation failed:")
        for error in errors:
            path = '.'.join([str(p) for p in error.path])
            print(f"- {path}: {error.message}")
        sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Usage: python validate_json.py <input_json> <schema_json>")
        sys.exit(1)
    input_path = sys.argv[1]
    schema_path = sys.argv[2]
    if not os.path.exists(input_path):
        print(f"[ERROR] Input file not found: {input_path}")
        sys.exit(1)
    if not os.path.exists(schema_path):
        print(f"[ERROR] Schema file not found: {schema_path}")
        sys.exit(1)
    data = load_json(input_path)
    schema = load_schema(schema_path)
    validate_json(data, schema)
    print("JSON is valid.")

if __name__ == "__main__":
    main()
