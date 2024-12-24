package com.example.demo.Task;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskDAO {
    private final JdbcTemplate jdbcTemplate;

    public TaskDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Task> getTasksByBoardId(int boardId) {
        return jdbcTemplate.query("SELECT * FROM tasks WHERE board_id = ?", (rs, rowNum) ->
            new Task(rs.getInt("id"), rs.getString("title"), rs.getString("status"), rs.getInt("board_id")), boardId);
    }

    public void addTask(Task task) {
        jdbcTemplate.update("INSERT INTO tasks (title, status, board_id) VALUES (?, ?, ?)",
                task.getTitle(), task.getStatus(), task.getBoardId());
    }
}