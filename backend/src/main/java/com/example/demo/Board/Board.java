package com.example.demo.Board;

public class Board {
    private int id;
    private String name;
    private String color;

    // Constructors
    public Board() {}

    public Board(int id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
