package com.example.demo.Task;

public class Task {
    private int id;
    private String title;
    private String status;
    private int boardId;

    public Task() {}

    public Task(int id, String title, String status, int boardId) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.boardId = boardId;
    }

    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getBoardId() { return boardId; }
    public void setBoardId(int boardId) { this.boardId = boardId; }
}