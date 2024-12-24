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

    public Board getBoardById(int id) {
        return jdbcTemplate.queryForObject(
            "SELECT * FROM board WHERE id = ?",
            (rs, rowNum) -> new Board(rs.getInt("id"), rs.getString("name"), rs.getString("color")),
            id
        );
    }

    public void saveBoard(Board board) {
        String sql = "INSERT INTO board (name, color) VALUES (?, ?) RETURNING id";
        int id = jdbcTemplate.queryForObject(sql, Integer.class, board.getName(), board.getColor());
        board.setId(id); // Set the ID for the created board
    }

    public void deleteBoard(int id) {
        jdbcTemplate.update("DELETE FROM board WHERE id = ?", id);
    }
}
