from flask import Flask, render_template, request, jsonify
import csv
import os
import datetime
import pandas as pd

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

CSV_FILE = 'indigo_silk_orders.csv'

@app.route('/')
def home():
    return render_template('restaurant_indigo_silk.html')

@app.route('/api/order_bangkok', methods=['POST'])
def place_order():
    data = request.json
    item_name = data.get('item_name')
    
    try:
        item_quantity = int(data.get('item_quantity', 1))
    except ValueError:
        item_quantity = 1
    
    order_id = 1000
    if os.path.exists(CSV_FILE):
        try:
            df = pd.read_csv(CSV_FILE)
            if not df.empty:
                order_id = int(df['order_id'].max())
        except Exception as e:
            print(f"Error reading CSV for max id: {e}")
            
    order_id += 1
    date_str = datetime.datetime.now().strftime('%Y-%m-%d')
    time_str = datetime.datetime.now().strftime('%H:%M')
    
    file_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['order_id','item_name','item_quantity','date','time'])
        writer.writerow([order_id, item_name, item_quantity, date_str, time_str])
        
    return jsonify({'success': True, 'message': 'Order placed successfully!'})

@app.route('/api/orders_bangkok', methods=['GET'])
def get_orders():
    if os.path.exists(CSV_FILE):
        try:
            df = pd.read_csv(CSV_FILE)
            return jsonify(df.to_dict('records'))
        except Exception:
            pass
    return jsonify([])

@app.route('/api/analytics_bangkok', methods=['GET'])
def analytics():
    if os.path.exists(CSV_FILE):
        try:
            df = pd.read_csv(CSV_FILE)
            if not df.empty:
                item_counts = df.groupby('item_name')['item_quantity'].sum().reset_index()
                data = {
                    'labels': item_counts['item_name'].tolist(),
                    'data': item_counts['item_quantity'].tolist()
                }
                return jsonify(data)
        except Exception as e:
            print(f"Chart Analytics error: {e}")
    return jsonify({'labels': [], 'data': []})

if __name__ == '__main__':
    app.run(debug=True, port=5007)
