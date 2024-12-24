package com.example.demo.TaskList;

public class TaskList {
    private int id;
    private String name;
    private int boardId;

    public TaskList(int id, String name, int boardId) {
        this.id = id;
        this.name = name;
        this.boardId = boardId;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getBoardId() {
        return boardId;
    }

    public void setBoardId(int boardId) {
        this.boardId = boardId;
    }
}
