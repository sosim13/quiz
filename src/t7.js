import React from "react";
import { useForm } from "react-hook-form";

function App() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("image", data.file[0]);

        const res = await fetch("https://dapi.kakao.com/v2/vision/text/ocr", {
            method: "POST",
		    headers: {
			  Authorization: `KakaoAK b7e80494b2e4956447d4885bfae95ff9`,
			  "Content-Type": "multipart/form-data",
		    },
            body: formData,
        }).then((res) => res.json());
        alert(JSON.stringify(`${res.msg}, status: ${res.code}`));
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input name="image" type="file" {...register("file")} />

                <input type="submit" />
            </form>
        </div>
    );
}

export default App;