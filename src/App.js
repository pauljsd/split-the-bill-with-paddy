import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    friendName: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    friendName: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    friendName: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(() => !showAddFriend);
  }

  function AddNewFriend(friend) {
    setFriends(() => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curFriend) =>
      curFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    // console.log(value);
    setFriends(
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <>
      <h1 className="title">We Outside 👩🏼‍🤝‍👩🏽</h1>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />

          {showAddFriend && <FormAddFriend onAddFriend={AddNewFriend} />}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <div>
      <ul>
        {friends.map((eachFriend) => (
          <Friend
            friend={eachFriend}
            key={eachFriend.id}
            friendName={eachFriend.friendName}
            pics={eachFriend.image}
            bal={eachFriend.balance}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({
  friend,
  selectedFriend,
  friendName,
  onSelection,
  pics,
  bal,
}) {
  const isSelect = selectedFriend?.id === friend.id;

  return (
    <div>
      <li className={isSelect ? "selected" : ""}>
        <img src={pics} alt={friendName} />
        <h3>{friendName}</h3>
        {bal < 0 && (
          <p className="red">
            You owe {friendName} {Math.abs(bal)} pa
          </p>
        )}
        {bal > 0 && (
          <p className="green">
            {friendName} dey owe me {Math.abs(bal)} pa
          </p>
        )}
        {bal === 0 && <p>me and {friendName} just dey</p>}
        <Button onClick={() => onSelection(friend)}>
          {isSelect ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!friendName || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      friendName,
      image,
      balance: 0,
    };
    onAddFriend(newFriend);
    console.log(newFriend);

    setFriendName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = Number(bill) - Number(paidByUser);
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handlesubmit(e) {
    e.preventDefault();

    if (!bill ?? !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>Split Bill with {selectedFriend.friendName} </h2>

      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧑‍🎤I go pay</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>✌️{selectedFriend.friendName} go pay😊</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who dey?🙂</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.friendName}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
