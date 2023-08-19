import { createEffect, createSignal } from 'solid-js'
import Prism from 'prismjs';

import {
  StyledContainer,
  StyledActions,
  StyledDisplay,
  StyledMessage,
  StyledPre,
  StyledPromptContainer,
  StyledPrompt,
} from "./Chat.styled";

import { parseMessagesForChat } from './utils';

export const Chat = (props) => {
  const [getPrompt, setPrompt] = createSignal("");

  // Create a ref for your scrollable element
  let scrollable;

  // Use createEffect to scroll down whenever data changes
  createEffect(() => {
    if ((props?.messages || []).length && scrollable) {
      Prism.highlightAll();
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight;
      }, 0);
    }
  });

  return (
    <StyledContainer class={props.class}>
      <StyledActions>
        {props.children && props.children}
      </StyledActions>
      <StyledDisplay ref={scrollable}>
        {parseMessagesForChat(props.messages, {
          omitCode: props.omitCode,
        }).map((message) => {
          return (
            <>
              {message.content && (
                <StyledMessage
                  isUser={message.role === "user"}
                  isAssistant={message.role === "assistant"}
                  isGenerator={message.role === "generator"}
                >
                  {message.content}
                </StyledMessage>
              )}

              {message.code_snippet && (
                <StyledPre>
                  <code class="language-javascript" innerHTML={
                    Prism.highlight(message.code_snippet, Prism.languages.javascript, 'javascript')
                  }></code>
                </StyledPre>
              )}
            </>
          );
        })}
      </StyledDisplay>

      <StyledPromptContainer>
        <StyledPrompt
          value={getPrompt()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (props.onEnter) {
                props.onEnter(getPrompt());
              }
              setTimeout(() => {
                setPrompt("");
              }, 0);
            }
          }}
          onChange={(value) => {
            setPrompt(value);
          }}
        />
      </StyledPromptContainer>
    </StyledContainer>
  );
}
