package com.example.demo.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskDAO taskDAO;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    public TaskController(TaskDAO taskDAO) {
        this.taskDAO = taskDAO;
    }

    @GetMapping("/board/{boardId}")
     public List<Task> getTasksByBoard(@PathVariable int boardId) {
        return taskDAO.getTasksByBoardId(boardId);
    }
    @GetMapping
    public List<Task> getAllTasks() {
        return jdbcTemplate.query("SELECT * FROM tasks", 
        (rs, rowNum) -> new Task(
            rs.getInt("id"),
            rs.getString("title"),
            rs.getString("status"),
            rs.getInt("board_id")
        )
    );
}
@GetMapping("/board/{boardId}/progress")
public Map<String, Object> getProgressByBoard(@PathVariable int boardId) {
    List<Task> tasks = taskDAO.getTasksByBoardId(boardId);

    long totalTasks = tasks.size();
    long doneTasks = tasks.stream().filter(task -> "done".equalsIgnoreCase(task.getStatus())).count();
    double progress = totalTasks == 0 ? 0 : ((double) doneTasks / totalTasks) * 100;

    Map<String, Object> response = new HashMap<>();
    response.put("totalTasks", totalTasks);
    response.put("doneTasks", doneTasks);
    response.put("progress", progress);

    return response;
}
    @PutMapping("/{id}/title")
        public void updateTaskTitle(@PathVariable int id, @RequestBody Task task) {
        jdbcTemplate.update("UPDATE tasks SET title = ? WHERE id = ?", task.getTitle(), id);
}
    @PostMapping
        public void addTask(@RequestBody Task task) {
        String sql = "INSERT INTO tasks (title, status, board_id) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, task.getTitle(), task.getStatus(), task.getBoardId());
}
@PutMapping("/{id}")
public void updateTask(@PathVariable int id, @RequestBody Task task) {
    jdbcTemplate.update("UPDATE tasks SET title = ?, status = ? WHERE id = ?", task.getTitle(), task.getStatus(), id);
}
    @DeleteMapping("/{id}")
        public void deleteTask(@PathVariable int id) {
        jdbcTemplate.update("DELETE FROM tasks WHERE id = ?", id);
    }
    @PutMapping("/{id}/status")
public void updateTaskStatus(@PathVariable int id, @RequestBody Map<String, String> request) {
    String status = request.get("status");
    jdbcTemplate.update("UPDATE tasks SET status = ? WHERE id = ?", status, id);
}
}

