# BPM

Business Process Manager 

OBS! The project will not be available on NPM until it reaches the Release Candidate (RC) stage of development.

## Proof of Concept (POC)

Currently in the Proof of Concept (POC) phase, this BPMN solution is under active development. Documentation will be made available in a later phase. For now, to start the server and commence operations locally, please run the following Bash commands:

```
sh do.sh
```

Prerequisites for running the `do.sh` script is Bash, Docker, and NPM.

The `do.sh` script facilitates the setup of Redis and MySQL servers, making them accessible on their default ports. You have the option to utilize the `do.sh` script for setup or proceed with manual configuration.

---

Upon completing the CLI commands specified, open your web browser and navigate to `localhost/_bpm/register/first-user` for initial registration. For login purposes, if not automatically prompted, visit `localhost/_bpm/login`.

Note: Should you encounter an authorization error after logging in, refresh the browser page to rectify this issue. This is a recognized problem within the message queue component that the BPM system relies on.

Note: The use of swimlanes should be optional, but currently some error occures when not using swimlanes...
