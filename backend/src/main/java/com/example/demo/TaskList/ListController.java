package com.example.demo.TaskList;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/lists")
@CrossOrigin(origins = "http://localhost:4200")
public class ListController {

    private final ListDAO listDAO;

    public ListController(ListDAO listDAO) {
        this.listDAO = listDAO;
    }

    @GetMapping("/board/{boardId}")
    public List<TaskList> getLists(@PathVariable int boardId) {
        return listDAO.getListsByBoardId(boardId);
    }

    @PostMapping
    public void createList(@RequestBody TaskList newList) {
        listDAO.createList(newList.getName(), newList.getBoardId());
    }

    @DeleteMapping("/{id}")
    public void deleteList(@PathVariable int id) {
        listDAO.deleteList(id);
    }
}
