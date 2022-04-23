import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eraseImage } from "../../store/images";
import { editDescription } from "../../store/images";
import Comments from "../Comments";
import './ImageDetail.css';

function ImageDetail({ image, showModal }) {
    const dispatch = useDispatch();
    const [editable, setEditable] = useState(false);
    const [imageUrl, setImageUrl] = useState(image.imageUrl);
    const [content, setContent] = useState(image.content);
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user);

    const fileSelected = event => {
        const file = event.target.files[0]
        setImageUrl(file)
    }

    useEffect(() => {
        const validationErrors = [];
        // if (!imageUrl.length) validationErrors.push("Please provide a valid URL");
        // if (imageUrl.length > 0 && !imageUrl.match(/^https?:\/\/.+\/.+$/)) validationErrors.push("Please provide a valid URL");
        if (!content.length) validationErrors.push("Please provide a description");
        setErrors(validationErrors);
    }, [imageUrl, content])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editDescription({ imageUrl, content, id: image.id, userId: user.id }))
        setEditable(!editable);
    }

    const deleteImage = async (e) => {
        e.preventDefault();
        dispatch(eraseImage(image));
        showModal(false);
    };

    const handleImgError = (e) => {
        e.target.src = '../../../../static/not-image.png';
    }

    return (
        <div className="modal-content-image">
            <div>
                <h2 className="single-image-title-detail">{image?.content}</h2>

                <img
                    className="single-image-detail"
                    key={image.id}
                    src={image.imageUrl}
                    alt={image.content}
                    onError={handleImgError}>
                </img>
            </div>
            {user && (user?.id === image?.userId) &&
                <>
                    <button className="delete-button-image" onClick={deleteImage}>
                        <i className="far fa-trash-alt"></i>
                    </button >
                    <button className="edit-button-image" onClick={() => {setEditable(!editable) }}>
                        <i className="far fa-edit"></i>
                    </button>
                </>
            }
            <div>
                {editable && (
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <ul className='errors-list'>
                            {errors.map((error, idx) => (
                                <li className='error' key={idx}>{error}</li>
                            ))}
                        </ul>
                        {/* <input
                            name='imageUrl'
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image URL"
                            required
                        /> */}
                        <label htmlFor="Description">Description</label>
                        <input
                            name='content'
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter a new description..."
                            required
                        />
                        <button
                            className="edit-button"
                            type="submit"
                            // disabled={errors.length > 0}
                        >Submit Edit</button>
                    </form>
                )}
            </div>
            <div className="comments-div">
                <span>
                    <Comments image={image} />
                </span>
            </div>
        </div >
    )
}


export default ImageDetail;
