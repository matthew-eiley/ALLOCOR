# Project Preparation - ECSE428 - Software Engineering Practice

## Allocor Asset Manager

1. Matthew Eiley, 261177542, matthew.eiley@mail.mcgill.ca
2. Trevor Piltch, 261171660, trevor.piltch@mail.mcgill.ca
3. Mario Ghorayeb, 261031910, mario.ghorayeb@mail.mcgill.ca
4. Boris Vassilev, 261081156, boris.vassilev@mail.mcgill.ca
5. Yixuan Qin, 261010963, yixuan.qin@mail.mcgill.ca
6. Youdas Yessad, 261183246, youdas.yessad@mail.mcgill.ca
7. Hakim Bekkari, 261043083, hakim.bekkari@mail.mcgill.ca

## Product Backlog

The product backlog is described in the MS Excel spreadsheet `backlog.xlsx`.

## Release Pipeline

### Source Control

The team will use GitHub for all work in this project. Source code, unit tests, automated acceptance tests, documentation, and project deliverables will be kept in source control.

### Build

The team will use Django and python for the backend and React for the front end. 

### Continuous Integration

This project will use GitHub Actions. For each feature requested in the sprint, the  merge of the pull request to main will trigger this action. The core actions are to build the system, run unit tests with Django, and acceptence tests with [Cucumber](https://github.com/cucumber/gherkin/tree/main/python) on the `.feature` files.

## Team Coordination

The team will perform all communication through a dedicated Discord server. Each sprint will commence with a planning meeting, to be hosted online and facilitated by the scrum master. Each sprint will conclude with retrospective/demo meeting for each member to showcase what was completed. Any additional meetings (pair programming, bug fixes, etc.) will be scheduled as needed through the Discord and managed by the scrum master.

For all project related tasks (documentation, issue tracking), we will be using GitHub to share this information and assign tasks to group members.

## Scrum Masters

**Sprint A:** Matthew Eiley, 261177542, matthew.eiley@mail.mcgill.ca

**Sprint B:** Trevor Piltch, 261171660, trevor.piltch@mailmcgill.ca

## Done Checklist

- [ ] All story related tasks have been completed.
- [ ] All of a story’s code has been peer reviewed and accepted.
- [ ] All of a story’s code is merged into main.
- [ ] Unit tests have been written, passed locally, and succeed in the build pipeline.
- [ ] Code builds successfully in the CI pipeline.
- [ ] All known bugs have been logged and accepted by all asset owners.
- [ ] All story specific acceptance tests succeed.
- [ ] Any story specific nonfunctional acceptance criteria are validated.
- [ ] Code is appropriately commented for clarity.
- [ ] Story-level documentation(README) are updated
