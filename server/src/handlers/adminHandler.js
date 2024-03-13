const { ObjectId } = require("mongodb");
const { getDb } = require("../db");
const { disableRoomId, disableHotelId, getAllUsers, getRoomById, disableUserById, deleteUser } = require("../controllers/adminController");


const disableUser = async (req, res) => {
  const {id} = req.params;
  try {
    if(!ObjectId.isValid(id)){
      res.status(404).send("Room id not valid")
      return
    }
    const result = await disableUserById(id);

    res.status(201).send(result)
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteUserByID = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const { id } = req.params;

    const result = await deleteUser(id);

    if (result.deletedCount <= 0) {
      return res.status(400).json({ message: "Cannot delete user" });
    }

    return res.status(201).send(result)
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
};

const disableRoom = async (req, res) => {
    const {id} = req.params;
    try {
      if(!ObjectId.isValid(id)){
        res.status(404).send("Room id not valid")
        return
      }
      const result = await disableRoomId(id);

      res.status(201).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  const getDisabledRooms = async (req, res) => {
    const db = getDb(); 
    try {
      const totalResults = await db.collection("rooms").countDocuments();
  
      const rooms = await db
        .collection("rooms")
        .find()
        .toArray();
  
      res.status(200).json({
        totalResults: totalResults,
        rooms: rooms,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };


  const disableHotel = async (req, res) => {
    const {id} = req.params;
    try {
      if(!ObjectId.isValid(id)){
        res.status(404).send("Room id not valid")
        return
      }
      const result = await disableHotelId(id);

      res.status(201).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  const getDisabledHotels = async (req, res) => {
    const db = getDb(); 
    try {
      const totalResults = await db.collection("hotels").countDocuments();
  
      const hotels = await db
        .collection("hotels")
        .find()
        .toArray();
  
      res.status(200).json({
        totalResults: totalResults,
        hotels: hotels,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  const getMixedSearch = async (req, res) => {
    try {
      const { address } = req.query;
      const db = getDb();
  
      if (!address) {
        return res.status(400).send("Wrong input handling");
      }
  
      const roomWithHotel = await db
        .collection("rooms")
        .aggregate([
          {
            $lookup: {
              from: "hotels",
              localField: "hotel_id",
              foreignField: "_id",
              as: "hotel",
            },
          },
          {
            $match: {
              "hotel.address": { $regex: new RegExp(address, "i") },
            },
          },
        ])
        .toArray();
  
      const hotel = await db
        .collection("hotels")
        .find({ "address": { $regex: new RegExp(address, "i") } })
        .toArray();
  
      const result = hotel.concat(roomWithHotel);
  
      res.status(200).json({
        result: result,
      });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const getLinkedRoom = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        res.status(404).send({error: "Your Id is not valid for a search"})
        return 
      } 
      users = await getRoomById(id);
      return res.status(200).send(users);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  const getUsers = async (req, res) => {
    try {
      const { name } = req.query;
  
      let users;
      if (name) {
        users = await getUserByName(name);
      } else {
        users = await getAllUsers();
      }
      return res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {
    disableRoom,
    getDisabledRooms,
    disableHotel,
    getDisabledHotels,
    getMixedSearch,
    getLinkedRoom,
    getUsers,
    disableUser,
    deleteUserByID
  }