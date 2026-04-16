import json
import re

SECTOR_MAP = {
    105: 'Healthcare',
    106: 'Trades & Construction',
    107: 'Home Services',
    108: 'Fitness & Leisure',
    109: 'Professional Services',
    110: 'Retail',
    111: 'Automotive',
    112: 'Tourism & Attractions',
    113: 'Beauty & Wellness',
}

with open('C:/Users/akiny/.claude/projects/C--nithdigital/6652216c-d3e1-44a9-b6fe-d7db3b2bd9ec.jsonl', 'r', encoding='utf-8-sig') as f:
    lines = f.readlines()

def extract_json_array(text):
    """Find the first JSON array in text"""
    start = text.find('[')
    if start == -1:
        return None
    depth = 0
    in_str = False
    escape = False
    for i in range(start, len(text)):
        c = text[i]
        if escape:
            escape = False
            continue
        if c == '\\' and in_str:
            escape = True
            continue
        if c == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return text[start:i+1]
    return None

results = {}

for line_num, sector in SECTOR_MAP.items():
    obj = json.loads(lines[line_num])
    msg = obj.get('message', {})
    content = msg.get('content', '')
    text = ''
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get('type') == 'tool_result':
                res_content = block.get('content', '')
                if isinstance(res_content, list):
                    for rb in res_content:
                        if isinstance(rb, dict) and rb.get('type') == 'text':
                            text += rb.get('text', '')
                elif isinstance(res_content, str):
                    text += res_content

    arr_str = extract_json_array(text)
    if arr_str:
        try:
            arr = json.loads(arr_str)
            results[sector] = arr
            print(f'{sector}: {len(arr)} records extracted OK')
        except json.JSONDecodeError as e:
            print(f'{sector}: JSON parse error: {e}')
            print(f'First 200 chars: {arr_str[:200]}')
    else:
        print(f'{sector}: No JSON array found')
        print(f'Text first 200: {text[:200]}')

# Write combined output
output_path = 'C:/nithdigital/scripts/websearch-batch-raw.json'
with open(output_path, 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print(f'\nWritten to {output_path}')
total = sum(len(v) for v in results.values())
print(f'Total records: {total}')
