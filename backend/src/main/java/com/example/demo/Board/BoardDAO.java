package com.example.demo.Board;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BoardDAO {

    private final JdbcTemplate jdbcTemplate;

    public BoardDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Board> getAllBoards() {
        return jdbcTemplate.query("SELECT * FROM board", (rs, rowNum) -> {
            String name = rs.getString("name") != null ? rs.getString("name") : "Unnamed Board";
            String color = rs.getString("color") != null ? rs.getString("color") : "#CCCCCC";
            return new Board(rs.getInt("id"), name, color);
        });
    }
    
    public void saveBoard(Board board) {
        String name = (board.getName() != null && !board.getName().isEmpty()) ? board.getName() : "Unnamed Board";
        String color = (board.getColor() != null && !board.getColor().isEmpty()) ? board.getColor() : "#CCCCCC"; // Default gray color
        
        jdbcTemplate.update("INSERT INTO board (name, color) VALUES (?, ?)", name, color);
    }
    

    public void deleteBoard(int id) {
        jdbcTemplate.update("DELETE FROM board WHERE id = ?", id);
    }
}
