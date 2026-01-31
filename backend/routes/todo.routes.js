import express from "express";
import Todo from "../models/todo.models.js"

const router = express.Router();

//get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// add a new todo
router.post("/", async (req, res) => {
    try {
        const newTodo = await Todo.create({
            text: req.body.text
        });
        res.status(201).json(newTodo);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//update a new Todo
router.patch("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo)
            return res.status(400).json({ message: "Todo Not found" })

        if (req.body.text !== undefined) {
            todo.text = req.body.text;
        }

        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed
        }

        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//deleted a todo
router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (todo) {
            await todo.destroy();
            res.json({ message: "Todo deleted" })
        } else {
            res.status(404).json({ message: "Todo not found" })
        }

    } catch (error) {
        res.status(400).json({ messge: error.message });
    }
})

export default router;