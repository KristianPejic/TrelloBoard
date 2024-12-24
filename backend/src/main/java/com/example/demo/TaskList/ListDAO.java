package com.example.demo.TaskList;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ListDAO {

    private final JdbcTemplate jdbcTemplate;

    public ListDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TaskList> getListsByBoardId(int boardId) {
        String sql = "SELECT * FROM list WHERE board_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new TaskList(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getInt("board_id")
            ), 
            boardId
        );
    }

    public void createList(String name, int boardId) {
        String sql = "INSERT INTO list (name, board_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, name, boardId);
    }

    public void deleteList(int id) {
        String sql = "DELETE FROM list WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
