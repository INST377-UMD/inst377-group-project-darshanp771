const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the cors middleware
const supabaseClient = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Use cors middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


const supabaseUrl = 'https://kcenvhjdtujjxtafmcvx.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZW52aGpkdHVqanh0YWZtY3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjIwNTgsImV4cCI6MjAxODQ5ODA1OH0.Kd41DVi2abxwuWXJrAXTkHAdAB90Uz1vdpuTbOJnJds';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});

app.get('/about', (req, res) => {
    res.sendFile('public/about.html', { root: __dirname });
});


app.get('/user-inputs', async (req, res) => {
    console.log('Getting User Inputs');

    const { data, error } = await supabase
        .from('user_input')
        .select('city, zip');

    if (error) {
        console.log(error);
    } else if (data) {
        res.send(data);
    }
});


app.post('/user-input', async (req, res) => {
    console.log('Adding User Input');

    const city = req.body.city;
    const zip = req.body.zip;

    const { data, error } = await supabase
        .from('user_input')
        .upsert([
            { city, zip }
        ]);

    if (error) {
        console.log(error);
        res.status(500).send(error);
    } else {
        console.log(data);
        res.header('Content-type', 'application/json');
        res.send(data);
    }
});

app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
});
