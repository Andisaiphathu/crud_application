from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template("index.html")

# In-memory data store (simulating a database)
users = [
    {"id": 1, "name": "Gift", "age": 25},
    {"id": 2, "name": "Lewis", "age": 27},
    {"id": 3, "name": "John", "age": 28}
]

@app.route("/users", methods=["GET"])
def get_users():
    """
    Retrieve the list of all users.
    """
    return jsonify(users), 200

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """
    Retrieve a specific user by their ID.
    """
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

@app.route("/users", methods=["POST"])
def create_user():
    """
    Add a new user with provided name and age.
    """
    data = request.get_json()

    # Validate input
    if not data or "name" not in data or "age" not in data:
        return jsonify({"error": "Name and age are required"}), 400

    new_id = max(user["id"] for user in users) + 1 if users else 1
    new_user = {
        "id": new_id,
        "name": data["name"],
        "age": data["age"]
    }
    users.append(new_user)
    return jsonify(new_user), 201

@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    """
    Update an existing user's name and/or age.
    """
    data = request.get_json()
    user = next((u for u in users if u["id"] == user_id), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user["name"] = data.get("name", user["name"])
    user["age"] = data.get("age", user["age"])
    return jsonify(user), 200

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """
    Delete a user by their ID.
    """
    global users
    user = next((u for u in users if u["id"] == user_id), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    users = [u for u in users if u["id"] != user_id]
    return jsonify({"message": "User deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
