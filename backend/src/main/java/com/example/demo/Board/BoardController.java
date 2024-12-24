package com.example.demo.Board;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards")
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
public class BoardController {

    private final BoardDAO boardDAO;

    public BoardController(BoardDAO boardDAO) {
        this.boardDAO = boardDAO;
    }

    @GetMapping
    public List<Board> getAllBoards() {
        return boardDAO.getAllBoards();
    }

   @PostMapping
    public Board createBoard(@RequestBody Board board) {
    boardDAO.saveBoard(board);
    return board; // Return the board object after saving
    }


    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable int id) {
        boardDAO.deleteBoard(id);
    }
}
