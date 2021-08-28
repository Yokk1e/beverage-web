import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Container,
  ListGroup,
  Card,
  Col,
  Row,
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import { useGetBeverages } from "./features/beverages/BeverageUseCase";
import { BeveragePaginationRequestParam } from "./features/beverages/forms/BeveragePaginationRequestParam";
import { Beverage, BeverageOption } from "./features/beverages/models/Beverage";
import {
  CreateOrderItemDto,
  CreateOrderSubItemDto,
} from "./features/orders/forms/CreateOrderForm";
import { Cart } from "./features/orders/models/Cart";
import { useCreateOrder } from "./features/orders/OrderUseCase";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BeverageList />
    </QueryClientProvider>
  );
}

function BeverageList() {
  const [formPagination] = useState<BeveragePaginationRequestParam>({
    limit: 99,
    page: 1,
    orderType: "DESC",
  });
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [beverages, refetch, isLoading] = useGetBeverages(formPagination);
  const [createOrder, isSubmiting, isSuccess] = useCreateOrder();
  const [beverage, setBeverage] = useState<Beverage>();

  function handleClickOpenModalAddToCart(beverage: Beverage) {
    setBeverage(beverage);
    setShowModal(true);
  }

  function handleAddToCart(cart: Cart) {
    const cartItemsTemp = [...cartItems, cart];
    const result: Record<string, Cart> = {};
    cartItemsTemp.forEach((cartItemTemp) => {
      const optionKey = cartItemTemp.beverageOptions
        ?.map((item) => item.id)
        .sort((a, b) => a - b)
        .join();
      if (result[`${cartItemTemp.name}_${optionKey}`]) {
        result[`${cartItemTemp.name}_${optionKey}`].amount +=
          cartItemTemp.amount;
      } else {
        result[`${cartItemTemp.name}_${optionKey}`] = { ...cartItemTemp };
      }
    });

    setCartItems(Object.values(result));
  }

  async function handleSubmit() {
    const orderItems: CreateOrderItemDto[] = cartItems.map((item: Cart) => {
      let orderSubItems: CreateOrderSubItemDto[];
      if (item.beverageOptions?.length) {
        orderSubItems = item.beverageOptions.map((item) => {
          return { beverageOptionId: item.id };
        });
      }
      return { beverageId: item.id, amount: item.amount, orderSubItems };
    });
    await createOrder({ orderItems });
  }

  useEffect(() => {
    if (isSuccess) {
      setCartItems([]);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <Container className="m-4">Loading ...</Container>;
  }

  return (
    <Container className="m-4">
      <h1>Beverage List</h1>
      <Row>
        <Col>
          <div className="d-flex justify-content-between gap-3 flex-wrap">
            {beverages.items.map((item, index) => {
              return (
                <BeverageCard
                  key={index}
                  beverage={item}
                  onClick={handleClickOpenModalAddToCart}
                />
              );
            })}
          </div>
        </Col>
        <Col md={4}>
          <OrderCart
            cartItems={cartItems}
            handleSubmit={handleSubmit}
            isLoading={isSubmiting}
          />
        </Col>
      </Row>
      <AddCartModal
        show={showModal}
        beverage={beverage}
        onClose={() => setShowModal(false)}
        addToCart={handleAddToCart}
      />
    </Container>
  );
}

interface BeverageCardProps {
  beverage: Beverage;
  onClick?: (beverage: Beverage) => void;
}

function BeverageCard({ beverage, onClick }: BeverageCardProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{beverage.name}</Card.Title>

        <Card.Text>{beverage.price} ฿</Card.Text>
        <Card.Link onClick={() => onClick(beverage)}>Add to Cart</Card.Link>
      </Card.Body>
    </Card>
  );
}

interface AddCartModalProps {
  show: boolean;
  beverage: Beverage;
  onClose: () => void;
  addToCart: (cart: Cart) => void;
}

function AddCartModal({
  show,
  beverage,
  onClose,
  addToCart,
}: AddCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [beverageOptions, setBeverageOptions] = useState<BeverageOption[]>([]);

  function handleAddtoCart() {
    const temp = beverageOptions;
    const tempQuantity = quantity;
    setBeverageOptions([]);
    setQuantity(1);
    addToCart({ ...beverage, amount: tempQuantity, beverageOptions: temp });
    onClose();
  }

  function handleChange(id: number) {
    if (beverage?.beverageOptions?.length) {
      let selected = beverageOptions;

      const find = selected.findIndex((item) => item.id === id);

      if (find > -1) {
        selected.splice(find, 1);
      } else {
        selected.push(beverage.beverageOptions.find((item) => item.id === id));
      }
      setBeverageOptions(selected);
    }
  }
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {beverage?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Quantity</h4>
        <InputGroup className="mb-3">
          <Button
            variant="outline-secondary"
            id="button-addon1"
            onClick={() => (quantity > 1 ? setQuantity(quantity - 1) : "")}
          >
            -
          </Button>
          <FormControl
            aria-label="Example text with button addon"
            aria-describedby="basic-addon1"
            value={quantity}
          />
          <Button
            variant="outline-secondary"
            id="button-addon1"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </InputGroup>
        {!!beverage?.beverageOptions?.length &&
          beverage.beverageOptions.map((option, index) => (
            <Form.Check
              key={index}
              label={`${option.name}`}
              name="group1"
              onChange={() => handleChange(option.id)}
              type={`checkbox`}
            />
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setQuantity(1);
            onClose();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleAddtoCart}>
          Add To Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface CartProps {
  cartItems: Cart[];
  handleSubmit: () => void;
  isLoading: boolean;
}
function OrderCart({ cartItems, handleSubmit, isLoading }: CartProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>Cart</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          Total :{" "}
          {cartItems?.reduce((pre, cur) => {
            let totalOptionPrice = 0;
            if (!!cur.beverageOptions?.length) {
              totalOptionPrice = cur.beverageOptions.reduce(
                (p, c) => p + c.price,
                0
              );
            }

            return pre + (cur.price + totalOptionPrice) * cur.amount;
          }, 0)}
        </ListGroup.Item>
      </ListGroup>
      <ListGroup variant="flush">
        {!!cartItems?.length &&
          cartItems.map((item, index) => {
            return (
              <ListGroup.Item key={`item${index}`}>
                <div className="d-flex justify-content-between">
                  <span>
                    {item.name} x{item.amount}
                  </span>
                  <span>
                    {(item?.beverageOptions.reduce(
                      (pre, cur) => pre + cur.price,
                      0
                    ) +
                      item.price) *
                      item.amount}
                    ฿
                  </span>
                </div>
                {!!item?.beverageOptions?.length &&
                  item?.beverageOptions.map((option, i) => (
                    <p
                      key={`option${i}`}
                    >{`${option.name} +(${option.price})`}</p>
                  ))}
              </ListGroup.Item>
            );
          })}
        <ListGroup.Item>
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            Submit
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default App;
