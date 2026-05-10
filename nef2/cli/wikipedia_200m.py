import argparse

from .. import AdamW, Tensor, cross_entropy, save_model
from ..byte_tokenizer import ByteTokenizer
from ..data import make_lm_batch
from ..datasets import wikipedia_text
from ..models import GPT, GPTConfig
from ..models.presets import estimate_gpt_parameters, gpt_200m_config


def collect_tokens(limit_articles, min_tokens):
    tokenizer = ByteTokenizer()
    tokens = []
    for text in wikipedia_text(limit=limit_articles):
        tokens.extend(tokenizer.encode(text))
        tokens.append(10)
        if len(tokens) >= min_tokens:
            break
    return tokenizer, tokens


def tiny_config(vocab_size, block_size):
    return GPTConfig(
        vocab_size=vocab_size,
        block_size=block_size,
        n_embd=16,
        n_layer=1,
        n_head=2,
    )


def main(argv=None):
    parser = argparse.ArgumentParser(description="Train NEF2 GPT models on Hugging Face Wikipedia.")
    parser.add_argument("--preset", choices=["tiny", "200m"], default="tiny")
    parser.add_argument("--articles", type=int, default=8)
    parser.add_argument("--steps", type=int, default=2)
    parser.add_argument("--batch-size", type=int, default=1)
    parser.add_argument("--block-size", type=int, default=16)
    parser.add_argument("--lr", type=float, default=0.001)
    parser.add_argument("--save", default=None)
    parser.add_argument("--instantiate-200m", action="store_true")
    args = parser.parse_args(argv)

    tokenizer, tokens = collect_tokens(args.articles, args.batch_size * args.block_size + 2)
    config = (
        gpt_200m_config(tokenizer.vocab_size, max(args.block_size, 1024))
        if args.preset == "200m"
        else tiny_config(tokenizer.vocab_size, args.block_size)
    )
    params = estimate_gpt_parameters(config)
    print("dataset=wikimedia/wikipedia config=20231101.en articles=%d tokens=%d" % (args.articles, len(tokens)))
    print("preset=%s params=%d block_size=%d" % (args.preset, params, config.block_size))

    if args.preset == "200m" and not args.instantiate_200m:
        print("200m config created. Use --instantiate-200m only when you accept the memory cost.")
        if args.save:
            with open(args.save, "w", encoding="utf-8") as f:
                f.write(
                    "{\n"
                    '  "format": "nef2-config",\n'
                    '  "preset": "200m",\n'
                    '  "params": %d,\n'
                    '  "vocab_size": %d,\n'
                    '  "block_size": %d,\n'
                    '  "n_embd": %d,\n'
                    '  "n_layer": %d,\n'
                    '  "n_head": %d\n'
                    "}\n"
                    % (
                        params,
                        config.vocab_size,
                        config.block_size,
                        config.n_embd,
                        config.n_layer,
                        config.n_head,
                    )
                )
            print("saved_config=%s" % args.save)
        return

    model = GPT(config)
    opt = AdamW(model.parameters(), lr=args.lr)
    for step in range(1, args.steps + 1):
        xb, yb = make_lm_batch(tokens, args.batch_size, args.block_size)
        loss = cross_entropy(model(xb), yb)
        opt.zero_grad()
        loss.backward()
        opt.step()
        print("step %d loss %.4f" % (step, loss.item()))

    out = model.generate(Tensor([[tokens[0]]]), 32).tolist()[0]
    print(ascii(tokenizer.decode(out)))
    if args.save:
        save_model(
            model,
            args.save,
            metadata={
                "preset": args.preset,
                "dataset": "wikimedia/wikipedia",
                "config": "20231101.en",
                "articles": args.articles,
                "tokens": len(tokens),
                "steps": args.steps,
                "block_size": args.block_size,
                "vocab_size": tokenizer.vocab_size,
            },
        )
        print("saved_model=%s" % args.save)


if __name__ == "__main__":
    main()
