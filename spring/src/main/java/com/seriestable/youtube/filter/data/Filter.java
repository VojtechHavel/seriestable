package com.seriestable.youtube.filter.data;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Filter {
    private boolean notStarted = true;
    private boolean started = true;
    private boolean finished = true;
    private boolean searchByTitle = true;
    private boolean searchByNote = false;
    private boolean searchByDescription = false;
    private SortByOption sortBy = SortByOption.NEWEST;
    private String title = "";
    private List<String> includeTags = new ArrayList<>();
    private List<String> excludeTags = new ArrayList<>();


}
