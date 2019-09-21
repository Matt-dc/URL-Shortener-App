import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, configure } from "enzyme";
import sinon from "sinon";
import UrlInput from "../components/UrlInput";

configure({ adapter: new Adapter() });

describe("<UrlInput />", () => {
  it("Should check component mounts", () => {
    const wrapper = shallow(<UrlInput />);
    expect(wrapper.find(".url-input").exists());
    expect(wrapper).toMatchSnapshot();
  });

  it("Checks if the shorten button is rendered", () => {
    const wrapper = shallow(<UrlInput />);
    expect(wrapper.find("Button").length).toEqual(1);
  });

  it("calls handleShorten on click", () => {
    const spy = sinon.spy();
    const wrapper = mount(<UrlInput handleShorten={spy} />);

    wrapper
      .find("Button")
      .first()
      .simulate("click");

    expect(spy.calledOnce).toBe(true);
  });
});
