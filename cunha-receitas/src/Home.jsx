import React, { useEffect, useState } from "react";

export const Home = () => {
  const [receitas, setReceitas] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [optionValue, setOptionValue] = useState("");
  //AMANHA: const [obj, setObj] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [imgValue, setImgValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [ingredientsValue, setIngredientsValue] = useState([
    { ingredient: "" },
  ]);
  const [preparationValue, setPreparationValue] = useState("");
  const [quantityPeople, setQuantityPeople] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("Receitas - UserToken"))
  );
  const [showReceita, setShowReceita] = useState(false);
  const [idShow, setIdShow] = useState("");

  async function getReceitas() {
    const res = await fetch("/api/receitas");
    const data = await res.json();
    console.log(data);
    setReceitas(data);
  }

  useEffect(() => {
    getReceitas();
    setInterval(() => {
      setLoggedIn(Boolean(localStorage.getItem("Receitas - UserToken")));
    }, 100);
  }, []);

  const handleAddIngredient = () => {
    setIngredientsValue((prv) => [...prv, { ingredient: "" }]);
  };

  const handleChange = (e, i) => {
    setIngredientsValue((prv) =>
      prv.map((ele, index) =>
        i === index ? { ingredient: e.target.value } : ele
      )
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/receitas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("Receitas - UserToken"),
      },
      body: JSON.stringify({
        tipo: typeValue,
        nome: nameValue,
        imgFood: imgValue,
        ingredientes: ingredientsValue.map((ele) => ele.ingredient),
        preparo: preparationValue,
        "quantidade de pessoas": quantityPeople,
      }),
    });
    resetStates();
    getReceitas();
  }

  const resetStates = () => {
    setNameValue("");
    setImgValue("");
    setTypeValue("");
    setIngredientsValue([{ ingredient: "" }]);
    setPreparationValue("");
    setQuantityPeople("");
  };

  const handleShowReceita = (id) => {
    setIdShow(id);
    setShowReceita((prv) => (prv && idShow === id ? false : true));
  };

  const handleRemoveInput = (index) => {
    console.log(index);
    console.log(ingredientsValue);
    ingredientsValue.length > 1 &&
      setIngredientsValue((prv) => prv.filter((ele, i) => i !== index));
  };

  return (
    <div className="pt-[10vh]">
      <div className="p-3 flex flex-col items-center">
        <div className="flex items-center w-[17rem] bg-red-500 relative">
          <input
            type="text"
            className="border-red-500 border-2 p-1 w-full"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <p className="absolute right-0">🔎</p>
        </div>
        <div className="justify-center flex pt-3 ">
          <select
            className="p-1 w-[17rem]"
            name=""
            id=""
            onChange={(e) => setOptionValue(e.target.value)}
            value={optionValue}
          >
            <option value="">--Please choose an option--</option>
            <option value="peixe">peixe</option>
            <option value="carne">carne</option>
            <option value="vegetariano">vegetariano</option>
            <option value="vegan">vegan</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-3">
          {receitas
            .filter((receitas) => {
              if (searchValue === "" && optionValue === "") {
                return receitas;
              } else if (
                receitas.nome
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) &&
                receitas.tipo.toLowerCase().includes(optionValue.toLowerCase())
              ) {
                return receitas;
              }
            })
            .map((ele) => (
              <div key={ele._id} className="">
                <div
                  className="relative cursor-pointer flex flex-col items-center"
                  onClick={() => handleShowReceita(ele._id)}
                  key={ele._id}
                >
                  <img
                    className="w-[10rem] h-[15vh] opacity-70 border-2 border-black hover:opacity-100"
                    src={ele.imgFood}
                    alt={ele.name}
                  />
                  <p className="absolute font-bold text-black text-[0.9rem]">
                    {ele.nome}
                  </p>
                </div>
                {showReceita && idShow === ele._id && (
                  <div className="mt-3 p-3 flex flex-col bg-gray-700 text-white max-w-[18rem] max-h-[40vh] overflow-y-auto">
                    <div className="">
                      <p className="w-[6.2rem] border-b-2 border-white font-bold">
                        Ingredientes:
                      </p>
                      <div className="flex gap-1">
                        {ele.ingredientes.map((ele) => (
                          <p key={ele}>{ele}</p>
                        ))}
                      </div>
                    </div>
                    <div className="">
                      <p className="w-[5.6rem] border-b-2 border-white font-bold">
                        preparacao:
                      </p>
                      <p className="">{ele.preparo}</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="border-b-2 border-white font-bold">
                        quant pessoas:
                      </p>
                      <p>{ele["quantidade de pessoas"]}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {loggedIn && (
        <div className="py-5">
          <form action="" className="" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 items-center">
              <label htmlFor="">Nome</label>
              <input
                required
                type="text"
                value={nameValue}
                className="border-2 border-black w-[17rem]"
                onChange={(e) => setNameValue(e.target.value)}
              />
              <label htmlFor="">Imagem</label>
              <input
                required
                type="text"
                value={imgValue}
                className="border-2 border-black w-[17rem]"
                onChange={(e) => setImgValue(e.target.value)}
              />
              <label htmlFor="">tipo</label>
              <select
                className="w-[17rem] p-1"
                name=""
                id=""
                onChange={(e) => setTypeValue(e.target.value)}
                value={typeValue}
                required
              >
                <option value="">--Please choose an option--</option>
                <option value="peixe">peixe</option>
                <option value="carne">carne</option>
                <option value="vegetariano">vegetariano</option>
                <option value="vegan">vegan</option>
              </select>
              <div className="flex gap-3">
                <label htmlFor="">ingredientes</label>
                <h1
                  className="cursor-pointer"
                  onClick={() => handleAddIngredient()}
                >
                  ➕
                </h1>
              </div>
              <div className="flex flex-col gap-3">
                {ingredientsValue.map((ele, i) => (
                  <div key={[i]} className="flex">
                    <input
                      required
                      type="text"
                      value={ele.ingredient}
                      className="border-2 border-black w-[15.5rem] mr-1"
                      onChange={(e) => handleChange(e, i)}
                    />
                    <button
                      onClick={() => handleRemoveInput(i)}
                      type="button"
                      className=""
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="">preparo</label>
              <textarea
                required
                value={preparationValue}
                type="text"
                className="border-2 border-black h-[15vh] w-[17rem]"
                onChange={(e) => setPreparationValue(e.target.value)}
              />
              <label htmlFor="">quant. Pessoas</label>
              <input
                value={quantityPeople}
                type="text"
                className="border-2 border-black w-[17rem]"
                onChange={(e) => setQuantityPeople(e.target.value)}
              />
              <button className="p-1 font-semibold w-30 border-2 border-black hover:bg-black hover:text-white">
                Criar Receita
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
