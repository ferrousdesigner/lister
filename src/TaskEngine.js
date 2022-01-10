import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./TaskEngine.css";
const maxTask = 25;
const maxItems = 25;

const scrollToBottom = (id) => {
  var objDiv = document.getElementById(id);
  if (!objDiv) return 
   objDiv.scrollTop = objDiv.scrollHeight;
};
export function DeleteButton(props) {
  const [step, setStep] = useState(1);

  return (
    <button
      className={"delete-btn " + (step === 2 ? "delete-warn" : "")}
      onClick={() => {
        if (step === 1) {
          setTimeout(() => {
            props.setWarn(false);
            setStep(1);
          }, 4000);
          props.setWarn(true);
          setStep(2);
        }
        if (step === 2) {
          setStep(3);
          props.onDelete();
          setTimeout(() => {
            props.setWarn(false);
            setStep(1);
          }, 4000);
        }
        if (step === 3) {
        }
      }}
    >
      {step === 1 && (props.label || "Delete")}
      {step === 2 && (props.warnLabel || "Are you sure? Click to confirm")}
      {step === 3 && (props.finalLabel || "Deleted")}
    </button>
  );
}
export function TaskElement(props) {
  const { task, onDeleteItem, setShowAmount, showAmount } = props;
  const noTasks = task?.lists && task?.lists.length === 0;
  const [showForm, setShowForm] = useState(null);

  const [input, setInput] = useState(null);
  const [amount, setAmount] = useState(0);
  const keyFunc = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      if (task?.lists.length >= maxItems)
        props.showAlert("Max limit reached.", "error");
      else {
        props.onUpdateList(task.id, input);
      }
      // Trigger the button element with a click
    }
  };
  const content = (
    <div className="actions">
      {showForm && (
        <div className="action-row">
          <h4>Item</h4>
          {showForm && (
            <input
              onKeyUp={keyFunc}
              className="task-input task-input-2"
              onChange={(e) => setInput(e.target.value)}
              value={input || ""}
              autoFocus
            />
          )}
          {showAmount && <h4>Amount</h4>}
          {showAmount && (
            <input
              onKeyUp={keyFunc}
              className="task-input task-input-2 task-input-3"
              onChange={(e) => setAmount(e.target.value)}
              value={amount || 0}
            />
          )}
        </div>
      )}
      <div>
        {!showForm && (
          <DeleteButton
            label="Delete Task"
            setWarn={props.setWarn}
            onDelete={() => {
              props.onSelectTask();
              setTimeout(() => props.onDeleteTask(task.id), 600);
            }}
          />
        )}
        {showForm && (
          <button className="add-task" onClick={() => setShowForm()}>
            Cancel
          </button>
        )}
        {!showForm && (
          <button
            className="add-task"
            onClick={() =>
              task?.lists?.length >= maxItems ? null : setShowForm("task")
            }
          >
            + Add Item
          </button>
        )}
        {showForm === "task" && (
          <button
            type="submit"
            className="add-task alt-btn alt-btn-2"
            onClick={() => {
              if (task?.lists.length >= maxItems)
                props.showAlert("Max limit reached.", "error");
              else {
                props.onUpdateList(task.id, { name: input, amount: amount });
              }
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
  return (
    <div>
      <h1 className="flex">
        <span
          className="fas fa-chevron-left back-btn"
          onClick={() => props.onSelectTask()}
        />
        {props?.task?.task}{" "}
        {showAmount && props?.task?.lists && props?.task?.lists
            ?.map((l) => l.amount).length > 0 && <span>
          (₹
          {props?.task?.lists
            ?.map((l) => l.amount)
            ?.reduce((a, b) => Number(a) + Number(b))}
          )
        </span>}
        <span className="status-chip">
          Task{" "}
          {props?.task?.status === "completed"
            ? "Completed"
            : props?.task?.status === "not_started"
            ? "Not Started"
            : "In Progress"}
        </span>
      </h1>
      <div className="toggle">
        <button
          onClick={() => setShowAmount(!showAmount)}
          className={showAmount ? "toggle-btn toggle-active" : "toggle-btn"}
        >
          <div className="inner-circle" />
        </button>
        {showAmount ? "Hide Amount" : "Show Amount"}
      </div>
      <div className="appear">
        {["completed", "in_progress"].includes(props?.task?.status) && (
          <button
            className="add-task btn-trans"
            onClick={() => props?.changeStatus(props?.task?.id, "not_started")}
          >
            Not Started
          </button>
        )}
        {["not_started", "in_progress"].includes(props?.task?.status) && (
          <button
            className="add-task btn-trans"
            onClick={() => props?.changeStatus(props?.task?.id, "completed")}
          >
            Complete
          </button>
        )}
        {["not_started", "completed"].includes(props?.task?.status) && (
          <button
            className="add-task btn-trans"
            onClick={() => props?.changeStatus(props?.task?.id, "in_progress")}
          >
            In Progress
          </button>
        )}
      </div>
      <span className="space" />
      {noTasks && "No Items"}
      {task?.lists?.length >= maxItems &&
        "Please delete some items from this list to add new item."}
      {!noTasks && (
        <div className="tasks-container" id="list-cont">
          <div className="tasks-container-top-shadow list-container-top-shadow" />
          {task?.lists.map((t, i) => {
            return (
              <p
                className="list-item"
                key={i}
                onClick={() => {
                  setAmount(t.amount);
                  setInput(t.name);
                  setShowForm("task");
                }}
              >
                {t?.name}{" "}
                <span
                  className="far fa-times-circle"
                  onClick={() => onDeleteItem(task.id, t)}
                />
                {t?.amount && showAmount && (
                  <span className="quantity">₹ {t?.amount}</span>
                )}
              </p>
            );
          })}
          <div className="tasks-container-bottom-shadow list-container-bottom-shadow" />
        </div>
      )}
      {window.innerWidth < 768
        ? ReactDOM.createPortal(content, document.body)
        : content}
    </div>
  );
}

export default function TaskEngine({
  tasks,
  onChange,
  onSignIn,
  user,
  onSignOut,
  saving,
}) {
  const noTasks = tasks && tasks.length === 0;
  const [showForm, setShowForm] = useState(null);
  const [input, setInput] = useState(null);
  const [selectedTask, onSelectTask] = useState(null);
  const [warn, setWarn] = useState(false);
  const [alert, setAlert] = useState({ task: null, type: "" });
      const [showAmount, setShowAmount] = useState(false);

  const submitForm = () => {
    let newTask = {
      id: new Date().getTime(),
      task: input,
      lists: [],
      status: "not_started",
      position: tasks.length + 1,
    };
    onChange([...tasks, newTask]);
    setInput();
    showAlert("Tasks Added");
    setShowForm();
  };
  const showAlert = (task, type = "info") => {
    setAlert({ task, type });
    setTimeout(() => {
      setAlert({ task: null, type: "" });
    }, 4000);
  };
  const changeStatus = (id, status) => {
    let tempTask = tasks && tasks.filter((task) => task.id === id)[0];
    tempTask.status = status;
    let othertasks = tasks && tasks.filter((task) => task.id !== id);
    let newTasks = [...othertasks, tempTask];
    onChange(newTasks);
    showAlert("Tasks Updated");
  };
  const updateList = (id, listItem) => {
    let tempTask = tasks && tasks.filter((task) => task.id === id)[0];
    let tempList = tempTask.lists;
    if (tempList.filter(tL => tL.name === listItem.name).length > 0) {
      let l = tempList.filter((tL) => tL.name === listItem.name)[0];
      if(l.amount !== listItem.amount) {
        l.amount = listItem.amount
        let othertasks = tasks && tasks.filter((task) => task.id !== id);
        let newTasks = [...othertasks, tempTask];
        onChange(newTasks);
        showAlert("Item updated", "success");
      } else {
        showAlert("Item already added", "error");
      }
      
    } else {
      tempList.push({name: listItem.name, amount: listItem.amount});
      tempTask.lists = tempList;
      let othertasks = tasks && tasks.filter((task) => task.id !== id);
      let newTasks = [...othertasks, tempTask];
      onChange(newTasks);
      showAlert("List Updated");
      scrollToBottom("list-cont");
    }
  };
  const onDeleteItem = (id, listItem) => {
    let tempTask = tasks && tasks.filter((task) => task.id === id)[0];
    let tempList = tempTask.lists;
      let newList = tempList.filter(items => items !== listItem);
      tempTask.lists = newList;
      let othertasks = tasks && tasks.filter((task) => task.id !== id);
      let newTasks = [...othertasks, tempTask];
      onChange(newTasks);
      showAlert("Item Deleted");
    //   scrollToBottom("list-cont");
  };
  const sortTasks = (ts) => {
    return ts.sort((a, b) => {
      //   console.log("A", a.position, b.position);
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
    });
  };

  const setupDragging = () => {
    // console.log("Setup Drag");
    let parent = document.querySelectorAll(".tasks-container-inner")[0];
    if (!parent) return;
    let draggables = document.querySelectorAll(".draggable");
    draggables.forEach((d) => {
      d.addEventListener("dragstart", () => {
        //   onSelectTask();
        d.classList.add("dragging");
      });
    });
    draggables.forEach((d) => {
      d.addEventListener("dragend", () => {
        d.classList.remove("dragging");
        savePositions();
      });
    });
    parent.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(parent, e.clientY);
      //   console.log(afterElement);
      const draggable = document.querySelectorAll(".dragging")[0];

      if (!afterElement) {
        parent.appendChild(draggable);
      } else {
        parent.insertBefore(draggable, afterElement);
      }
      // console.log("draggable", draggable);
    });
  };
  const getDragAfterElement = (container, y) => {
    let dragElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];
    return dragElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          //   console.log("True");
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };
  useEffect(() => {
    setupDragging();
  }, [tasks]);
  const onDeleteTask = (id) => {
    onChange(tasks.filter((t) => t.id !== id));
  };
  const savePositions = () => {
    let draggables = [...document.querySelectorAll(".draggable")];
    let positionHash = draggables.map((d, i) => {
      let id = d.getAttribute("data-id");
      return { id, position: i + 1 };
    });
    console.log("positionHash", positionHash);
    let newTasks = tasks.map((task) => {
      task.position = positionHash.filter(
        (t) => String(t.id) === String(task.id)
      )[0]?.position;
      return task;
    });
    onChange(newTasks);
    console.log("newTasks", newTasks);
  };
  //   console.log(selectedTask);

  return (
    <div className={"task-engine "}>
      <div className={"alert-container " + (alert.type || "")}>
        <span
          className={
            alert.type === "error"
              ? "fas fa-times-circle"
              : alert.type === "success"
              ? "fas fa-check-circle"
              : "fas fa-info-circle"
          }
        />
        {alert.task}
        <span className="fas fa-times close" onClick={() => setAlert({})} />
      </div>
      <div className="task-panes task-pane-one">
        <div className="logo-bar">
          <h1 className="logo">Listup</h1>
          <div className="flex">
            {user && saving && (
              <div style={{ marginRight: 20 }}>
                Saving to cloud{"  "}{" "}
                <span
                  style={{ marginLeft: 6 }}
                  className="fas fa-circle-notch fa-spin"
                />
              </div>
            )}
            {!user && window.innerWidth > 768 && (
              <div style={{ marginRight: 10 }}>
                {" "}
                To auto save and sync{" "}
              </div>
            )}
            <div
              className="avatar"
              style={user ? {} : { width: '14rem', borderRadius: "3rem" }}
              onClick={onSignIn}
            >
              {user && (
                <img
                  width={50}
                  height={50}
                  alt="user-dp"
                  src={user?.photoURL}
                />
              )}
              {!user && (
                <div style={{ color: "white" }}>
                  Sign in with
                  <span
                    className="fab fa-google"
                    style={{ marginLeft: 10, color: "white" }}
                  />
                </div>
              )}
            </div>

            {user && (
              <div
                className="avatar"
                onClick={onSignOut}
                style={{ marginLeft: 10 }}
              >
                <span className="fas fa-sign-out-alt" />
              </div>
            )}
          </div>
        </div>
        <span className="space" />
        <h3>{noTasks ? 0 : tasks.length} tasks</h3>
        <br />
        {tasks.length >= maxTask && (
          <div style={{ color: "red" }}>
            Please delete some task to add a new task as you have reached max
            limit of {maxTask}.
          </div>
        )}
        <br />
        {!noTasks && (
          <div className="tasks-container">
            <div className="tasks-container-top-shadow" />
            <div className="tasks-container-inner">
              {sortTasks(tasks).map((t, i) => {
                return (
                  <button
                    draggable="true"
                    data-id={String(t.id)}
                    className={
                      selectedTask?.id === t.id
                        ? "task active-task draggable"
                        : "task draggable"
                    }
                    style={{
                      opacity: t.status === "completed" ? 0.3 : 1,
                    }}
                    key={i}
                    onClick={() =>
                      selectedTask?.id === t.id
                        ? onSelectTask()
                        : onSelectTask(t)
                    }
                  >
                    <span>
                      {t.task}{" "}
                      {t.status === "in_progress" && (
                        <span className="fas fa-arrow-left progress-sign" />
                      )}
                    </span>
                    <span className="fas fa-grip-vertical" />
                  </button>
                );
              })}
            </div>
            <div className="tasks-container-bottom-shadow" />
          </div>
        )}

        <div className="actions">
          <div>
            {showForm && (
              <input
                className="task-input"
                onChange={(e) => setInput(e.target.value)}
                value={input || ""}
                autoFocus
                maxLength={20}
              />
            )}
          </div>
          <div style={{ opacity: tasks.length >= maxTask && 0.4 }}>
            {showForm && (
              <button className="add-task" onClick={() => setShowForm()}>
                Cancel
              </button>
            )}
            {!showForm && (
              <button
                className="add-task"
                disabled={tasks.length >= maxTask}
                onClick={() =>
                  tasks.length <= maxTask ? setShowForm("task") : null
                }
              >
                + Add Task
              </button>
            )}
            {showForm === "task" && (
              <button
                type="submit"
                className="add-task alt-btn"
                onClick={() => submitForm()}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          " task-panes task-pane-two " +
          (selectedTask ? "pane-active " : "") +
          (warn ? "error" : "")
        }
      >
        {selectedTask && <div className="arrow-right"></div>}
        {selectedTask?.status === "completed" && (
          <span className="task-status-container">
            <span className="fas fa-check-circle task-status" />
          </span>
        )}
        {selectedTask?.status === "in_progress" && (
          <span className="task-status-container">
            <span className="fas fa-clock task-status" />
          </span>
        )}
        {selectedTask?.status === "not_started" && (
          <span className="task-status-container">
            <span className="fas fa-info-circle task-status" />
          </span>
        )}
        {selectedTask && (
          <TaskElement
            task={selectedTask}
            onDeleteItem={onDeleteItem}
            changeStatus={changeStatus}
            onUpdateList={updateList}
            showAlert={showAlert}
            setWarn={setWarn}
            onDeleteTask={onDeleteTask}
            onSelectTask={onSelectTask}
            setShowAmount={setShowAmount}
            showAmount={showAmount}
          />
        )}
      </div>
    </div>
  );
}
