import React,{useState} from "react";
import axios from "axios";

export default function  OwnerPost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [photo, setPhoto] = useState("");


    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleLocationChange = (e) => setLocation(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("price", price);
        if (photo) {
            formData.append("photo", photo);
        }

        axios.post("http://localhost:8000/owner/post/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

            .then(response => {
                alert("Successfully uploaded");
                console.log('Success', response.data);
            })
            .catch(error => {
                alert('Something went wrong');
            });
    };

    return (
        <div>
            <h2>Post Your House</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">House Title: </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        required/>
                </div>

                <div>
                    <label htmlFor="title">Desciption: </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        required/>
                </div>

                <div>
                    <label htmlFor="title">Location: </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={handleLocationChange}
                        required/>
                </div>

                <div>
                    <label htmlFor="title">Price </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        required/>
                </div>

                <div>
                    <label htmlFor="title">Upload Photo </label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        required/>
                </div>
                <button type="submit">Post house</button>
            </form>
        </div>
    );


}