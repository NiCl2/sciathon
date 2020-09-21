import os, re, json
import itertools
from flask import Flask
from flask import request, abort, jsonify
import pymongo
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

mongo_user = os.environ['MONGODB_US']
mongo_pass = os.environ['MONGODB_PASS']
db_name = 'article_scores'
collection_name = 'article_scores1'
collection_req_name = 'requests'

match_website_field = 'url'

client = pymongo.MongoClient(
   "mongodb+srv://{}:{}@sciathon-a2eyh.gcp.mongodb.net/{}?retryWrites=true&w=majority".format(mongo_user, mongo_pass, db_name)
)
db = client[db_name]

@app.route('/')
def hello():
    return "Hello World from authentisci!"

@app.route('/api/v1/demo', methods=['GET'])
def demo():
    entries_list = []
    ii = 0
    for p in db[collection_name].find():
        p.pop('_id', None)
        entries_list.append(p)
        ii += 1
        if ii > 10: break
    return jsonify(entries_list)

@app.route('/api/v1/all', methods=['GET'])
def api_all():
    entries_list = []
    for p in db[collection_name].find():
        p.pop('_id', None)
        entries_list.append(p)
    entries_list = sorted(entries_list, key=lambda x : x['url'])
    entries_summary = []
    for url, group in itertools.groupby(entries_list, lambda x : x['url']):
        grouped = list(group)
        n = len(grouped)
        ent = {}
        ent['url'] = url
        ent['bias'] = sum([g['bias'] for g in grouped])/n
        ent['clarity'] = sum([g['clarity'] for g in grouped])/n
        ent['score'] = sum([g['score'] for g in grouped])/n
        ent['sources'] = sum([g['sources'] for g in grouped])/n
        ent['n'] = n
        entries_summary.append(ent)
    return jsonify(entries_summary)

@app.route('/api/v1/match', methods=['GET'])
def match():
    address = request.args.get('ad', default = None)
    if address == None:
        return jsonify([])
    entries_list = []
    for p in db[collection_name].find({match_website_field: {'$in': [ re.compile(address)]}}):
        p.pop('_id', None)
        entries_list.append(p)
    return jsonify(entries_list)

@app.route('/api/v1/add', methods=['POST'])
def add():
    record = request.data
    record = json.loads(record)
    mandatory_fields = ['url', 'score', 'clarity', 'bias']
    for k in mandatory_fields:
        assert k in record.keys(), '*{}* missing'.format(k)
    try:
        status = db[collection_name].insert_one(record)
        print('added', status.acknowledged)
        st = True
        return jsonify([st]), 200
    except Exception as e:
        print(e)
        print('problem with adding record')
        st = False
        return jsonify([st]), 400

@app.route('/api/v1/request', methods=['POST'])
def suggest():
    record = request.data
    record = json.loads(record)
    mandatory_fields = ['url']
    for k in mandatory_fields:
        assert k in record.keys(), '*{}* missing'.format(k)
    try:
        status = db[collection_req_name].insert_one(record)
        print('added', status.acknowledged)
        st = True
        return jsonify([st]), 200
    except Exception as e:
        print(e)
        print('problem with adding record')
        st = False
        return jsonify([st]), 400

@app.route('/api/v1/all_requests', methods=['GET'])
def all_suggestions():
    entries_list = []
    for p in db[collection_req_name].find():
        p.pop('_id', None)
        entries_list.append(p)
    return jsonify(entries_list)


@app.route('/api/v1/average', methods=['GET'])
def average():
    address = request.args.get('ad', default = None)
    if address == None:
        return jsonify([])
    sources = []
    score = []
    clarity = []
    bias = []
    for p in db[collection_name].find({match_website_field: {'$in': [ re.compile(address)]}}):
        p.pop('_id', None)
        sources.append(p['sources'])
        score.append(p['score'])
        clarity.append(p['clarity'])
        bias.append(p['bias'])
    n = len(bias)
    if n == 0:
        abort(400, 'Error: no entries found matching your address')
    var = {
        'sources': int(sum(sources)/n),
        'score': int(sum(score)/n),
        'clarity': int(sum(clarity)/n),
        'bias': int(sum(bias)/n),
        'n': n
    }
    return jsonify(var)

if __name__ == '__main__':
    app.run()
