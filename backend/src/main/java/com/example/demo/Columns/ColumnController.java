package com.example.demo.Columns;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/columns")
@CrossOrigin(origins = "http://localhost:4200")
public class ColumnController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{boardId}")
    public List<Map<String, Object>> getColumns(@PathVariable int boardId) {
        String sql = "SELECT * FROM columns WHERE board_id = ? ORDER BY position";
        return jdbcTemplate.queryForList(sql, boardId);
    }
    
    @PostMapping
    public void addColumn(@RequestBody Map<String, Object> columnRequest) {
        String boardId = columnRequest.get("boardId").toString();
        String name = columnRequest.get("status").toString();
        int position = columnRequest.get("position") != null
            ? Integer.parseInt(columnRequest.get("position").toString())
            : 0; 
    
       
        String sql = "INSERT INTO columns (name, board_id, position) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, name, Integer.parseInt(boardId), position);
    }
    

    @DeleteMapping("/{boardId}/{name}")
    public void deleteColumn(@PathVariable int boardId, @PathVariable String name) {
        
        String deleteTasksSql = "DELETE FROM tasks WHERE board_id = ? AND status = ?";
        int tasksDeleted = jdbcTemplate.update(deleteTasksSql, boardId, name);
        System.out.println("Deleted " + tasksDeleted + " tasks associated with column: " + name);
    
        
        String deleteColumnSql = "DELETE FROM columns WHERE board_id = ? AND name = ?";
        int columnsDeleted = jdbcTemplate.update(deleteColumnSql, boardId, name);
        System.out.println("Deleted " + columnsDeleted + " columns with name: " + name);
    }
    
}