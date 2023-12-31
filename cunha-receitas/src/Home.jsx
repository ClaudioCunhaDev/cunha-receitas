import React, { useEffect, useRef, useState } from "react";

export const Home = () => {
  const [receitas, setReceitas] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [ingredientsValue, setIngredientsValue] = useState([
    { ingredient: "" },
  ]);
  const nameRef = useRef();
  const imgRef = useRef();
  const typeRef = useRef();
  const quantityPeopleRef = useRef();
  const preparationValueRef = useRef();
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
        tipo: typeRef.current.value,
        nome: nameRef.current.value,
        imgFood: imgRef.current.value,
        ingredientes: ingredientsValue.map((ele) => ele.ingredient),
        preparo: preparationValueRef.current.value,
        "quantidade de pessoas": quantityPeopleRef.current.value,
      }),
    });
    resetStates();
    getReceitas();
  }

  const resetStates = () => {
    nameRef.current.value = "";
    imgRef.current.value = "";
    typeRef.current.value = "";
    nameRef.current.value = "";
    preparationValueRef.current.value = "";
    quantityPeopleRef.current.value = "";
    setIngredientsValue([{ ingredient: "" }]);
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
      <div className="p-3 flex flex-col items-center lg:flex-row lg:justify-center lg:gap-3">
        <div className="flex items-center w-[17rem] relative">
          <input
            type="text"
            className=" border-2 p-1 w-full"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Pesquisa a receita..."
          />
          <p className="absolute right-0">🔎</p>
        </div>
        <div className="justify-center flex pt-3 lg:pt-0">
          <select
            className="p-1 w-[17rem] px-1"
            name=""
            id=""
            onChange={(e) => setOptionValue(e.target.value)}
            value={optionValue}
          >
            <option value="">--Por favor Escolhe o tipo--</option>
            <option value="peixe">peixe</option>
            <option value="carne">carne</option>
            <option value="vegetariano">vegetariano</option>
            <option value="vegan">vegan</option>
            <option value="sobremesas">sobremesas</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
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
                    className="w-[10rem] h-[15vh] opacity-70 border-2 border-black hover:opacity-100 lg:w-[15rem] lg:h-[16vh]"
                    src={ele.imgFood}
                    alt={ele.name}
                  />
                  <p className="absolute font-bold text-black text-[0.9rem]">
                    {ele.nome}
                  </p>
                </div>
                {showReceita && idShow === ele._id && (
                  <div className="mt-3 p-3 flex flex-col bg-gray-700 text-white max-w-[18rem] max-h-[40vh] overflow-y-auto lg:bg-gray-500">
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
                placeholder="Risotto de Cogumelos"
                required
                type="text"
                className="border-2 border-black w-[17rem] px-1"
                ref={nameRef}
              />
              <label htmlFor="">Imagem</label>
              <input
                placeholder="image address"
                required
                type="text"
                className="border-2 border-black w-[17rem] px-1"
                ref={imgRef}
              />
              <label htmlFor="">tipo</label>
              <select
                className="w-[17rem] px-1 p-1"
                name=""
                id=""
                ref={typeRef}
                required
              >
                <option value="">--Por favor Escolhe o tipo--</option>
                <option value="peixe">peixe</option>
                <option value="carne">carne</option>
                <option value="vegetariano">vegetariano</option>
                <option value="vegan">vegan</option>
                <option value="sobremesas">sobremesas</option>
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
                      placeholder="400 gramas de cogumelos frescos (Portobello/branco ou marrom e/ou shitake ou shimeji)  "
                      required
                      type="text"
                      value={ele.ingredient}
                      className="border-2 border-black w-[15.5rem] mr-1 px-1"
                      onChange={(e) => handleChange(e, i)}
                    />
                    <button onClick={() => handleRemoveInput(i)} type="button">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="">preparo</label>
              <textarea
                placeholder="Corte os cogumelos: Lave os cogumelos rapidamente com água e seque-os imediatamente com papel toalha/rolo de cozinha ou limpe-os com uma escovinha ou pano umedecido."
                required
                ref={preparationValueRef}
                type="text"
                className="border-2 border-black h-[15vh] w-[17rem] px-1"
              />
              <label htmlFor="">quant. Pessoas</label>
              <input
                ref={quantityPeopleRef}
                type="text"
                className="border-2 border-black w-[17rem] px-1"
                placeholder="4"
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
