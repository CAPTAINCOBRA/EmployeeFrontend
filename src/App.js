// 07-05-2022 Bug-1 Loader
// 07-05-2022 Bug-2 Create Button Handling
// 07-05-2022 Bug-3 Update Button Handling
// 07-05-2022 Bug-4 Validation

import "./App.css";
import { Navbar, Container, Form, Button, Modal, Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import Toast from "./components/Toast/Toast.js";
import Loader from "./components/Loader/Loader.js"; //Bug 1

import { ToastContainer, toast, Slide } from "react-toastify";
toast.configure();

function App() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    setLoader(true); //Bug 1
    getAllUsers();
  }, []);

  // const serverUrl = "http://localhost:8000/api";
  const serverUrl = "https://employee-api-backend.herokuapp.com/api";

  const [showCreateEmployee, setShowCreateEmployee] = useState(false);

  const [loader, setLoader] = useState(false); //Bug 1

  const [createButton, setCreateButton] = useState(false); //Bug 2
  const [updateButton, setUpdateButton] = useState(false); //Bug 3

  const [showLogin, setShowLogin] = useState(false);
  const onLoginClick = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);

  const [showAll, setShowAll] = useState(false);
  const onShowAllClick = () => setShowAll(true);
  const handleShowAllClose = () => setShowAll(false);

  // const onCreateEmployeeClick = () => setShowCreateEmployee(true);
  const onCreateEmployeeClick = () => {
    setShowCreateEmployee(true);
    setCreateButton(true); //Bug 2
  };
  // const handleCreateEmployeeClose = () => setShowCreateEmployee(false);
  const handleCreateEmployeeClose = () => {
    setCreateButton(false); //Bug 2
    setUpdateButton(false); //Bug 3

    setShowCreateEmployee(false);
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeAge("");
    setEmployeeDepartment("");
  };

  const getAllUsers = () => {
    // axios.get("http://localhost:8000/api/employees").then((res) => {
    axios
      .get(`${serverUrl}/employees`)
      .then((res) => {
        setAllUsers(res.data);
        setLoader(false); //Bug 1
      })
      .catch((err) => {
        console.log(err);
        setLoader(false); //Bug 1

        const msg = (
          <Toast err={true} msg="Error Fetching All Users. Contact Admin!" />
        );

        toast.error(msg, {
          className: "ToastErr Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAge, setEmployeeAge] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  const [loginMail, setLoginMail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [currentUserId, setCurrentUserId] = useState("");

  const onEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const onEmployeeEmailChange = (e) => {
    setEmployeeEmail(e.target.value);
  };

  const onEmployeeAgeChange = (e) => {
    setEmployeeAge(e.target.value);
  };

  const onEmployeeDepartmentChange = (e) => {
    setEmployeeDepartment(e.target.value);
  };

  const onEmployeePasswordChange = (e) => {
    setEmployeePassword(e.target.value);
  };

  const onLoginEmailChange = (e) => {
    setLoginMail(e.target.value);
  };

  const onLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const onCreateEmployeeSubmit = (e) => {
    e.preventDefault();
    setLoader(true); //Bug 1

    // Bug 4
    if (
      employeeName === "" ||
      employeeEmail === "" ||
      employeeAge === "" ||
      employeeDepartment === "" ||
      employeePassword === ""
    ) {
      setLoader(false); //Bug 1

      const msg = <Toast err={true} msg="All Fields are required!" />;

      toast.error(msg, {
        className: "ToastErr Toast",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      // Bug 4 ends
      // Now we can Create the Employee
      const newEmployee = {
        name: employeeName,
        email: employeeEmail,
        age: employeeAge,
        department: employeeDepartment,
        password: employeePassword,
      };
      axios
        // .post("http://localhost:8000/api/employee/create", newEmployee)
        .post(`${serverUrl}/employee/create`, newEmployee)
        .then((res) => {
          setLoader(false); //Bug 1
          setAllUsers([...allUsers, res.data]);
          setEmployeeAge("");
          setEmployeeDepartment("");
          setEmployeeEmail("");
          setEmployeeName("");
          setEmployeePassword("");

          // console.log(res.data);
          // setCurrentUserId(res.data._id); // Imp Bug TODO: Fix this

          const msg = (
            <Toast err={false} msg="Employee Created Successfully!" />
          );

          toast.success(msg, {
            className: "ToastSucc Toast",
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          handleCreateEmployeeClose();
          setCreateButton(false); //Bug 2
        })
        .catch((err) => {
          setLoader(false); //Bug 1
          console.log(err);

          const msg = <Toast err={true} msg="Employee Creation Failed" />;

          toast.error(msg, {
            className: "ToastErr Toast",
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } // Bug 4
  };

  const handleEditEmployee = (e, id) => {
    e.preventDefault();
    setUpdateButton(true); //Bug 3

    // axios.get(`http://localhost:8000/api/employee/${id}`).then((res) => {
    axios
      .get(`${serverUrl}/employee/${id}`)
      .then((res) => {
        setEmployeeName(res.data.name);
        setEmployeeEmail(res.data.email);
        setEmployeeAge(res.data.age);
        setEmployeeDepartment(res.data.department);
        setEmployeePassword(res.data.password);
        setShowCreateEmployee(true);
        setCurrentUserId(id);
      })
      .catch((err) => {
        console.log(err);

        const msg = (
          <Toast
            err={true}
            msg="Error Fetching Employee. Try refreshing the page!"
          />
        );

        toast.error(msg, {
          className: "ToastErr Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleUpdateEmployee = (e, id) => {
    e.preventDefault();
    setLoader(true); //Bug 1
    setShowCreateEmployee(false);
    const updatedEmployee = {
      name: employeeName,
      email: employeeEmail,
      age: employeeAge,
      department: employeeDepartment,
      password: employeePassword,
    };

    axios
      // .put(`http://localhost:8000/api/employee/${id}`, updatedEmployee)
      .put(`${serverUrl}/employee/${id}`, updatedEmployee)
      .then((res) => {
        setUpdateButton(false); //Bug 3
        getAllUsers();
        setLoader(false); //Bug 1

        const msg = <Toast err={false} msg="Employee Updated Successfully!" />;

        toast.success(msg, {
          className: "ToastSucc Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setUpdateButton(false); //Bug 3
        setLoader(false); //Bug 1
        console.log(err);

        const msg = <Toast err={true} msg="Employee Updation Failed" />;

        toast.error(msg, {
          className: "ToastErr Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleDeleteEmployee = (e, id) => {
    e.preventDefault();
    setLoader(true); //Bug 1
    // axios.delete(`http://localhost:8000/api/employee/${id}`).then((res) => {
    axios
      .delete(`${serverUrl}/employee/${id}`)
      .then((res) => {
        setLoader(false); //Bug 1
        getAllUsers();

        const msg = <Toast err={false} msg="Employee Deleted Successfully!" />;

        toast.success(msg, {
          className: "ToastSucc Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setLoader(false); //Bug 1
        console.log(err);

        const msg = <Toast err={true} msg="Employee Deletion Failed" />;

        toast.error(msg, {
          className: "ToastErr Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleEmployeeLogin = (e) => {
    e.preventDefault();
    setLoader(true); //Bug 1

    const loginDetails = {
      email: loginMail,
      password: loginPassword,
    };

    // axios.get(`http://localhost:8000/api/employee/${id}`).then((res) => {
    axios
      .post(`${serverUrl}/employee/signin`, loginDetails)
      .then((res) => {
        setLoader(false); //Bug 1
        setShowLogin(false);
        setLoginMail("");
        setLoginPassword("");

        const msg = (
          <Toast err={false} msg="Employee Logged in Successfully!" />
        );

        toast.success(msg, {
          className: "ToastSucc Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setLoader(false); //Bug 1
        console.log(err);

        setLoginPassword("");

        const msg = <Toast err={true} msg="Employee Login Failed" />;

        toast.error(msg, {
          className: "ToastErr Toast",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            Employee Management System by Ekansh Baweja
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="empContainer">
        <Button
          className="mt-3"
          variant="primary"
          onClick={onCreateEmployeeClick}
        >
          Create Employee
        </Button>

        <Button className="mt-3" variant="primary" onClick={onLoginClick}>
          Login
        </Button>

        <Button className="mt-3" variant="primary" onClick={onShowAllClick}>
          All Employees
        </Button>
      </div>

      <Modal show={showCreateEmployee} onHide={handleCreateEmployeeClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="employeeName"
                onChange={onEmployeeNameChange}
                value={employeeName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="employeeEmail"
                onChange={onEmployeeEmailChange}
                value={employeeEmail}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="employeePassword"
                onChange={onEmployeePasswordChange}
                value={employeePassword}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 mt-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="employeeAge"
                onChange={onEmployeeAgeChange}
                value={employeeAge}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="employeeDepartment"
                onChange={onEmployeeDepartmentChange}
                value={employeeDepartment}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateEmployeeClose}>
            Close
          </Button>
          {updateButton && ( //Bug 3
            <Button
              variant="primary"
              onClick={(e) => handleUpdateEmployee(e, currentUserId)}
            >
              Update
            </Button>
          )}
          {createButton && ( //Bug 2
            <Button
              type="submit"
              variant="success"
              onClick={onCreateEmployeeSubmit}
            >
              Create
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showLogin} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="emailValue"
                autoFocus
                onChange={onLoginEmailChange}
                value={loginMail}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="passwordValue"
                onChange={onLoginPasswordChange}
                value={loginPassword}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoginClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={(e) => handleEmployeeLogin(e)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAll} fullscreen={true} onHide={handleShowAllClose}>
        <Modal.Header closeButton>
          <Modal.Title>All Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Department</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>{user.department}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={(e) => handleEditEmployee(e, user._id)}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={(e) => handleDeleteEmployee(e, user._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <ToastContainer transition={Slide} />
      {loader && <Loader />}
    </div>
  );
}

export default App;
