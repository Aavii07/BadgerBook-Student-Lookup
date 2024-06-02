import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Student from './Student';
import Pagination from 'react-bootstrap/Pagination';

const Classroom = () => {

    const [studentData, setStudentData] = useState([]);
    const url = "https://cs571api.cs.wisc.edu/rest/su24/hw4/students";

    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchInput, setSearchInput] = useState({ name: '', major: '', interest: '' });
    
    const [page, setPage] = useState([1]);
    const [shownStudents, setShownStudents] = useState([]);

    useEffect(() => {
        fetch(url, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId() 
            }
        })
        .then(response => response.json())
        .then(data => {
            setStudentData(data);
            setFilteredStudents(data); 
            setPage(1);
            console.log(data);
        })
        .catch(error => console.error('Error fetching student data:', error));
    }, []);

    // filter students based on search terms
    const filterStudents = () => {
        // normalize search terms
        const searchName = searchInput.name.trim().toLowerCase();
        const searchMajor = searchInput.major.trim().toLowerCase();
        const searchInterest = searchInput.interest.trim().toLowerCase();

        let filtered = studentData;

        // filter by name
        if (searchName) {
            filtered = filtered.filter(student => {
                const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
                return fullName.includes(searchName);
            });
        }

        // filter by major
        if (searchMajor) {
            filtered = filtered.filter(student => {
                return student.major.toLowerCase().includes(searchMajor);
            });
        }

        // filter by interest
        if (searchInterest) {
            filtered = filtered.filter(student => {
                return student.interests.some(interest => interest.toLowerCase().includes(searchInterest));
            });
        }

        setFilteredStudents(filtered);
    };

    useEffect(() => {
        filterStudents();
        setPage(1);
        renderPaginationButtons();
    }, [searchInput, studentData]);

    useEffect(() => {
        const start = (page - 1) * 24;
        const end = page * 24;
        setShownStudents(filteredStudents.slice(start, end));
    }, [filteredStudents, page]);

    const handleUpdateInput = (event) => {
        setSearchInput({ ...searchInput, [event.target.name]: event.target.value });
    };
    const resetSearch = () => {
        setSearchInput({ name: '', major: '', interest: '' });
    };

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(filteredStudents.length / 24);
        let items = [];
        for (let i = 1; i <= totalPages; i++) { 
            items.push(
                <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredStudents.length / 24);
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" onChange={handleUpdateInput} name="name" value={searchInput.name}/> 
            {/* value connects form inputs to searchInput, so everything is cleared when you hit reset search*/}
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" onChange={handleUpdateInput} name="major" value={searchInput.major}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" onChange={handleUpdateInput} name="interest" value={searchInput.interest}/>

            <br />
            <Button variant="neutral" onClick={resetSearch}>Reset Search</Button>
        </Form>
        <p style = {{marginTop: '40px'}}> There are {filteredStudents.length} student(s) matching your search.</p>
        <Container fluid>
            <Row>
                {shownStudents.map(student => (
                    <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}>
                         <Student {...student} /> 
                    </Col> // spread automatically sets all attributes
                ))}
            </Row>
        </Container>
        <Pagination style={{ justifyContent: 'center' }}>
                <Pagination.Prev 
                    onClick={handlePreviousPage} 
                    disabled={page === 1}> 
                    Previous 
                </Pagination.Prev>

                {renderPaginationButtons()}

                <Pagination.Next 
                    onClick={handleNextPage} 
                    disabled={page === Math.ceil(filteredStudents.length / 24)}> 
                    Next 
                </Pagination.Next>
        </Pagination>
        
    </div>

}

export default Classroom;