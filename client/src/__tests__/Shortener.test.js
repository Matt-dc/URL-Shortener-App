import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import axios from "axios";

import Shortener from "../components/Shortener";
import UrlInput from "../components/UrlInput";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("<Shortener />", () => {
  it("Should check for child components", () => {
    const wrapper = shallow(<Shortener />);

    expect(wrapper.find(UrlInput));
  });

  //   it("Should check that data is retrieved from the API call", () => {
  //     const urlObject = { ul: "http://random.url" };
  //     const response = { data: urlObject };
  //     axios.get.mockResolvedValue(() => Promise.resolve(response));
  //   });
});
