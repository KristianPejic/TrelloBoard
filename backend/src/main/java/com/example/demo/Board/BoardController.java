package com.example.demo.Board;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards")
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {

    private final BoardDAO boardDAO;

    public BoardController(BoardDAO boardDAO) {
        this.boardDAO = boardDAO;
    }

    @GetMapping
    public List<Board> getAllBoards() {
        return boardDAO.getAllBoards();
    }

    @GetMapping("/{id}")
    public Board getBoardById(@PathVariable int id) {
        try {
            return boardDAO.getBoardById(id);
        } catch (Exception e) {
            throw new RuntimeException("Board not found with ID: " + id, e);
        }
    }

    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        System.out.println("Creating board: " + board.getName());
        boardDAO.saveBoard(board);
        System.out.println("Board created: " + board);
        return board;
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable int id) {
        boardDAO.deleteBoard(id);
    }
}
