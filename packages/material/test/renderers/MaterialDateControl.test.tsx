/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { Provider } from 'react-redux';
import {
  Actions,
  ControlElement,
  getData,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import MaterialDateControl, {
  materialDateControlTester
} from '../../src/controls/MaterialDateControl';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';

const initJsonFormsStore = (testData, testSchema, testUiSchema): Store<JsonFormsState> => {
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: materialRenderers,
        fields: materialFields,
      }
    }
  );

  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

const data = { 'foo': '1980-06-04' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date'
    },
  },
};
const uischema = {
  type: 'Control',
  scope: '#/properties/foo',
};

describe('Material date control tester', () => {

  test('should fail', () => {
    expect(materialDateControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
            bar: {
              type: 'string',
              format: 'date',
            },
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'date',
            },
          },
        },
      )
    ).toBe(4);
  });
});

describe('Material date control', () => {

  /** Use this container to render components */
  const container = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it('should autofocus first element', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstDate: { type: 'string', format: 'date' },
        secondDate: { type: 'string', format: 'date' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstDate',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondDate',
      options: {
        focus: true
      }
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement
      ]
    };
    const store = initJsonFormsStore(
      {
        firstDate: '1980-04-04',
        secondDate: '1980-04-04'
      },
      schema,
      uischema
    );
    const tree = ReactDOM.render(
      <Provider store={store}>
        <HorizontalLayoutRenderer schema={jsonSchema} uischema={layout}/>
      </Provider>,
      container
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    expect(document.activeElement).not.toBe(inputs[0]);
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={control}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={control}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.autofocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={control}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.autofocus).toBeFalsy();
  });

  it('should render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.value).toBe('1980-06-04');
  });

  it('should update via event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    input.value = '1961-04-12';
    TestUtils.Simulate.change(input);
    expect(getData(store.getState()).foo).toBe('1961-04-12');
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => '1961-04-12'));
    expect(input.value).toBe('1961-04-12');
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => null));
    expect(input.value).toBe('');
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => undefined));
    expect(input.value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('bar', () => 'Bar'));
    expect(input.value).toBe('1980-06-04');
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update(null, () => '1961-04-12'));
    expect(input.value).toBe('1980-06-04');
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update(undefined, () => '1961-04-12'));
    expect(input.value).toBe('1980-06-04');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema} enabled={false}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });

  it('should render input id', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema} id='#/properties/foo'/>
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    // there is only input id at the moment
    expect(input.id).toBe('#/properties/foo-input');
  });
});
