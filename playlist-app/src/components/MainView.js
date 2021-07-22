import React, { useEffect, useState } from 'react';
import { Modal, Fab, Snackbar, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import NewGenerator from './NewGenerator';
import GeneratorCard from './GeneratorCard';
import Search from './Search';
import Generator from '../Generator';

const MainView = ({
    hide,
    user,
    at,
    setError
}) => {
    const [showNew, setShowNew] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [generators, setGenerators] = useState(null);
    const [genToEdit, setGenToEdit] = useState(null);

    useEffect(() => {
        const getGenerators = async () => {
            try {
                fetch(`http://localhost:8888/generator?user_id=${user.id}`)
                .then(response => response.json())
                .then(json => {
                    if (json.error) {
                        throw json.error;
                    } else {
                        const generators = [];
                        for (const gen in json) {
                            generators.push(new Generator(json[gen]));
                        }
                        setGenerators(generators)
                    }
                })
            } catch(e) {
                setError(e);
            }
        }
        if (user) {
            getGenerators()
        }
    }, [user, setError]);

    const removeGenerator = (id) => setGenerators((generators) => generators.filter((g) => g.id !== id));

    const toggleModal = () => setShowNew((prev) => !prev);
    const generatorCards = generators ? generators.map((gen => <GeneratorCard generator={gen} at={at} setError={setError} removeGenerator={removeGenerator} edit={(formData) => { setGenToEdit(formData); toggleModal();}} />)) : null;
    const NewGen = React.forwardRef((props, ref) => <NewGenerator  {...props} ref={ref} />)
    if (hide) return null;
    return (
        <div className="Main">
            <div className="Main__activities">
                <Search /*filter gen cards by value here, pass onKeyUp*/ />
                <Fab color="primary" aria-label="add">
                    <AddIcon onClick={toggleModal} />
                </Fab>
            </div>
            <div className="Main__GeneratorCards">
                {generatorCards ? generatorCards : 
                    <div className="Main__noGenerators">
                        <Typography variant="h4" component="h2" color="textSecondary">
                        Click the plus icon to get started.
                        </Typography>
                    </div>}
            </div>
            <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSuccess(false)} severity="success">
                        Your playlist generator has been saved
                </MuiAlert>
            </Snackbar>
            <Modal 
                open={showNew}
                onBackdropClick={toggleModal}
            >   
                <NewGen at={at} user={user} setError={setError} setGenerators={setGenerators} exisitingGenerator={genToEdit}
                closeSelf={
                    () => {
                        setShowNew(false);
                        setShowSuccess(true);
                        setGenToEdit(null);
                    }
                } />
            </Modal>
        </div>
    );
};

export default MainView;



/**

•   code including inheritance, polymorphism, and encapsulation
•   search functionality with multiple row results and displays
•   a database component with the functionality to securely add, modify, and delete the data
•   ability to generate reports with multiple columns, multiple rows, date-time stamp, and title doneish
•   exception controls == add toasts for errors doneish
•   validation functionality == submit validation for required fields done


 remaining todos/ bugs
 - generes aren't transitioning correctly
 - limit not being passed to db
 - duplicate key update not working on generator? 
 - delete query and endpoint
 - search endpoint and page
 - reports
 - update deep equals on main activity
 - reauthentication on all auth endpoints
 * 
 */

