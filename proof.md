# How to read this proof

You might want to first examine the [problem statement](#problem-statement), to understand what are we even doing.

Next it will be useful to read [definitions](#definitions).

Then you can read the [actual proof](#solution). Every time you encounter some lemma, you can find it in and read about it in [lemmas section](#lemmas)

# Definitions

I use the mathematical definition of floating-point numbers from
[here](https://www.math.usm.edu/lambers/mat460/fall09/lecture4.pdf) (page 4)

I define $\mathbb{F}$ to be a finite set 
of all floating-point numbers and $fl(x)$ to 
be a function $\mathbb{R} \rightarrow \mathbb{F}$ 
that maps a real number to a floating-point number closest to it.

You can see that if $x \in \mathbb{F}$, then $fl(x) = x$.

I use the definition of machine espilon from [here](https://www.math.usm.edu/lambers/mat460/fall09/lecture5.pdf) (page 1). Note that in the PDF
it is called 'machine precision'. I will referer to it as machine epsilon or
simply $\epsilon_m$.

The computations we study here use [fast inverse square root](https://en.wikipedia.org/wiki/Fast_inverse_square_root) algorithm. You can look at
implementation of it in TypeScript in the file `src/inverse-sqrt.ts`.

In proofs we refer to it as function $isq(x)$, $\mathbb{F} \rightarrow \mathbb{F}$

# Problem statement

Given $x, y, m \in \mathbb{F}$, $m > 0$, we have the following computations:

$$
l = (x \cdot x) + (y \cdot y)
$$

$$
s = \dfrac{m}{\sqrt{l}}
$$

$$
x_1 = sx \\
y_1 = sy
$$

$$
l_1 = (x_1 \cdot x_1) + (y_1 \cdot y_1)
$$

$$
s_1 = \dfrac{m}{\sqrt{l_1}}
$$

We execute these computations using their approximations in floating-point arithmetic:

$$
\hat{l} = fl(fl(x \cdot x) + fl(y \cdot y))
$$

$$
s = fl(m \cdot isq(\hat{l}))
$$

$$
x_1 = fl(\hat{s} \cdot x) \\
y_1 = fl(\hat{s} \cdot y)
$$

$$
\hat{l}_1 = fl(fl(\hat{x}_1 \cdot \hat{x}_1) + fl(\hat{y}_1 \cdot \hat{y}_1))
$$

$$
\hat{s}_1 = fl(m \cdot isq(\hat{l}_1))
$$

Find the maximum relative error in computation of $\hat{s}_1$.

To state the problem more formally, find such $\epsilon_{s_1} \in \mathbb{R}$,
$\epsilon_{s_1} > 0$, that

$$
\forall x, y \mathbb{F}, m \in \{ n \in  \mathbb{F} \mid n > 0 \} : \\
|\dfrac{\hat{s}_1 - s_1}{s_1}| \leq \epsilon_{s_1}
$$

# Lemmas

## Lemma 1

If $a$ is a real number other than $0$, $\hat{a}$ is its approximation, and $\epsilon$ 
is the maximum relative error between them, we write

$$
|\dfrac{\hat{a} - a}{a}| \leq \epsilon 
$$

Then, we can also state that

$$
\hat{a} = a(1 + \delta) \text{ for some } \delta \in \mathbb{R} \text{ such that }
|\delta| \leq \epsilon
$$

Or, more formally

$$
\exists \delta \in \mathbb{R} : |\delta| \leq \epsilon \land \hat{a} = a(1 + \delta)
$$

### Proof

We can first show that there exists such $\delta$ that $\hat{a} = a(1 + \delta)$, and then prove that $|\delta| \leq \epsilon$

If $\hat{a} = a(1 + \delta)$ then $\delta = \dfrac{\hat{a}}{a} - 1$. $\delta$ exists if $a \neq 0$, which is true by defnition.

$$
|\dfrac{\hat{a} - a}{a}| = |\dfrac{|\hat{a} - a|}{|a|} \leq \epsilon \\
|\hat{a} - a| \leq \epsilon|a|
$$

By triangle inequality ($|a - b| \geq |a| - |b|$), 

$$
|\hat{a}| - |a| \leq |\hat{a} - a| \text{, so} \\
|\hat{a}| - |a| \leq \epsilon|a| \\
|\hat{a}| \leq \epsilon|a| + |a|
$$

Substituting $a(1 + \delta)$ instead of $\hat{a}$, we get

$$
|a(1 + \delta)| = |a| + |\delta||a| \leq |a| + \epsilon|a|
$$

$$
|a| + |\delta||a| \leq |a| + \epsilon|a| \\
|\delta||a| \leq \epsilon|a| \\
|\delta| \leq \epsilon
$$

$\square$

## $fl(x)$ function

$fl(x)$ returns the floating-point number closest to $x$. By definition
of machine epsilon,

$$
|\dfrac{fl(x) - x}{x}| \leq \epsilon_m
$$

By lemma 1, we can state that

$$
fl(x) = x(1 + \delta) \text{ for some } \delta \in \mathbb{R} \text{ such that } |\delta| \leq \epsilon_m
$$

Later in the proof we will denote errors from floating-point conversion as $\delta_i, i \in \mathbb{N}, |\delta_i| \leq \epsilon_m$. So if we define some $\delta_{42}$, it is implied that $|\delta_{42}| \leq \epsilon_m$

## Fast inverse square root

Fast inverse square root is the function 

$$
isq(x) = \dfrac{1}{\sqrt{x}}(1 + \delta_{isq}) \text{ for some }
\delta_{isq} \in \mathbb{R} \text { such that } |\delta_{isq}| \leq 
\epsilon_{isq}
$$

Where $\epsilon_{isq}$ - the maximum relarive error of $isq(x)$. This number exists and can be found experimentally. In the proof we will simply refere to it as $\epsilon_{isq}$, and will compute it's exact
value later.

## Lemma 2

Given $a, a_{min}, a_{max}, b, b_{min}, b_{max} \in \mathbb{R}$, such that

$$
a > 0 \\
b > 0 \\
a_{min} \leq a \leq a_{max} \\
b_{min} \leq b \leq b_{max}
$$

It is true that

$$
\dfrac{a_{min}}{b_{max}} \leq \dfrac{a}{b} \leq \dfrac{a_{max}}{b_{min}}
$$

### Proof

Invert the inequality $b_{min} \leq b \leq b_{max}$:

$$
\dfrac{1}{b_{min}} \geq \dfrac{1}{b} \geq \dfrac{1}{b_{max}}
$$

Multiply all sides by $a$. Since $a > 0$, inequality signs don't change:

$$
\dfrac{a}{b_{min}} \geq \dfrac{a}{b} \geq \dfrac{a}{b_{max}} =
\dfrac{a}{b_{max}} \leq \dfrac{a}{b} \leq \dfrac{a}{b_{min}}
$$

We know that

$$
a \leq a_{max}
$$

Multiplying both sides by $\dfrac{1}{b}$ ($b > 0$)

$$
\dfrac{a}{b} \leq \dfrac{a_{max}}{b}
$$

Mutiplying both sides of $\dfrac{1}{b} \leq \dfrac{1}{b_{min}}$ by $a_{max}$

$$
\dfrac{a_{max}}{b} \leq \dfrac{a_{max}}{b_{min}} 
$$

So

$$
\dfrac{a}{b} \leq \dfrac{a_{max}}{b_{min}}
$$

We also know that

$$
a_{min} \leq a
$$

Multiplying both sides by $\dfrac{1}{b}$

$$
\dfrac{a_{min}}{b} \leq \dfrac{a}{b}
$$

Mutiplying both sides of $\dfrac{1}{b_{max}} \leq \dfrac{1}{b}$ by $a_{min}$

$$
\dfrac{a_{min}}{b_{max}} \leq \dfrac{a_{min}}{b}
$$

So 

$$
\dfrac{a_{min}}{b_{max}} \leq \dfrac{a}{b}
$$

Finally,

$$
\dfrac{a_{min}}{b_{max}} \leq \dfrac{a}{b} \leq \dfrac{a_{max}}{b_{min}}
$$

$\square$

## Lemma 3

If $a$ is a real number and $\hat{a}$ is its approximation with maximum relative error $\epsilon_a$, then

$$
isq(\hat{a}) = \dfrac{1}{\sqrt{a}}(1 + \delta_{isqa}) \text{ for some } 
\delta_{isqa} \in \mathbb{R} \text{ such that } 
|\delta_{isqa}| \leq \epsilon_{isqa}
$$

Where

$$
\epsilon_{isqa} = max(
    |\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_a}} - 1|, 
    |\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_a}} - 1|
)
$$

### Proof

By lemma 1, we can state that

$$
\hat{a} = a(1 + \delta_a) \text{ for some } \delta_a \in \mathbb{R}
\text{ such that } |\delta_a| \leq \epsilon_a
$$

$$
isq(\hat{a}) = \dfrac{1}{\sqrt{\hat{a}}}(1 + \delta_{isq}) = 
\dfrac{1}{\sqrt{a}\sqrt{1 + \delta_a}}(1 + \delta_{isq}) =
$$

$$
\dfrac{1}{\sqrt{a}} \cdot \dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}}
$$

We can rewrite the second fraction as 

$$
\dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}} = 1 + (\dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}} - 1)
$$

So we can write

$$
isq(\hat{a}) = \dfrac{1}{\sqrt{a}}(1 + \delta_{isqa})
$$

Where 

$$
\delta_{isqa} = (\dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}} - 1)
$$

By definition, we know that

$$
1 - \epsilon_{isq} \leq 1 + \delta_{isq} \leq 1 + \epsilon_{isq} \\
$$

And

$$
\sqrt{1 - \epsilon_a} \leq \sqrt{1 + \delta_a} \leq \sqrt{1 + \epsilon_a}
$$

By lemma 2, 

$$
\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_a}} \leq 
\dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}} \leq
\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_a}}
$$

Subtracting $1$ from all sides:

$$
(\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_a}} - 1) \leq 
(\dfrac{1 + \delta_{isq}}{\sqrt{1 + \delta_a}} - 1) \leq
(\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_a}} - 1)
$$

By the definition of $\delta_{isqa}$

$$
(\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_a}} - 1) \leq 
\delta_{isqa} \leq
(\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_a}} - 1)
$$

As $\delta_{isqa}$ is clamped by two values, we can write

$$
|\delta_{isqa}| \leq max(
    |\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_a}} - 1|,
    |\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_a}} - 1|
)
$$

By definition of $\epsilon_{isqa}$, $|\delta_{isqa}| \leq \epsilon_{isqa}$ 

$\square$

# Solution
## $\hat{l}$

$$
\hat{l} = fl(fl(x \cdot x) + fl(y \cdot y))
$$

By lemma 1,

$$
\hat{l} = [(x \cdot x)(1 + \delta_1) + (y \cdot y)(1 + \delta_2)](1 + \delta_3) = \\
(x \cdot x)(1 + \delta_1)(1 + \delta_3) + (y \cdot y)(1 + \delta_2)(1 + \delta_3) = \\
(x \cdot x)(1 + \delta_1 + \delta_3 + \delta_1\delta_3) + (y \cdot y)(1 + \delta_2 + \delta_3 + \delta_2\delta_3)
$$

The relative error is

$$
|\dfrac{\hat{l} - l}{l}| = \dfrac{|\hat{l} - l|}{|l|}
$$

$$
|\hat{l} - l| = |(x \cdot x)(\delta_1 + \delta_3 + \delta_1\delta_3) + (y \cdot y)(\delta_2 + \delta_3 + \delta_2\delta_3)|
$$

By triangle inequality ($|a + b| \leq |a| + |b|$) and multiplicativity of absolute value ($|ab| = |a||b|$),

$$
|(x \cdot x)(\delta_1 + \delta_3 + \delta_1\delta_3) + (y \cdot y)(\delta_2 + \delta_3 + \delta_2\delta_3)| \leq \\
|x \cdot x||\delta_1 + \delta_3 + \delta_1\delta_3| + |y \cdot y||\delta_2 + \delta_3 + \delta_2\delta_3|
$$

By triangle inequality,

$$
|\delta_1 + \delta_3 + \delta_1\delta_3| \leq 
\epsilon_m + \epsilon_m + \epsilon_m^2
$$

$$
|\delta_2 + \delta_3 + \delta_2\delta_3| \leq 
\epsilon_m + \epsilon_m + \epsilon_m^2
$$

Since $x \in \mathbb{F}$, $x \cdot x > 0$, so $|x \cdot x| = x \cdot x$. Same for $|y \cdot y| = y \cdot y$

$$
|x \cdot x||\delta_1 + \delta_3 + \delta_1\delta_3| = (x \cdot x)|\delta_1 + \delta_3 + \delta_1\delta_3| \leq (x \cdot x)(\epsilon_m + \epsilon_m + \epsilon_m^2)
$$

$$
|y \cdot y||\delta_2 + \delta_3 + \delta_2\delta_3| = (y \cdot y)|\delta_2 + \delta_3 + \delta_2\delta_3| \leq (y \cdot y)(\epsilon_m + \epsilon_m + \epsilon_m^2)
$$

$$
|x \cdot x||\delta_1 + \delta_3 + \delta_1\delta_3| + |y \cdot y||\delta_2 + \delta_3 + \delta_2\delta_3| \leq \\
(x \cdot x)(\epsilon_m + \epsilon_m + \epsilon_m^2) + (y \cdot y)(\epsilon_m + \epsilon_m + \epsilon_m^2)
$$

$$
|\hat{l} - l| \leq [(x \cdot x) + (y \cdot y)](\epsilon_m + \epsilon_m + \epsilon_m^2)
$$

$$
\dfrac{|\hat{l} - l|}{|l|} \leq \dfrac{[(x \cdot x) + (y \cdot y)](\epsilon_m + \epsilon_m + \epsilon_m^2)}{(x \cdot x) + (y \cdot y)} = \epsilon_m + \epsilon_m + \epsilon_m^2
$$

So, by lemma 1, we can state that

$$
\hat{l} = l(1 + \delta_l) \text { for some } \delta_l \in \mathbb{R}
\text{ such that } |\delta_l| \leq \epsilon_l
$$

Where $\epsilon_l = 2\epsilon_m + \epsilon_m^2$

## $\hat{s}$

By lemma 1:

$$
\hat{s} = fl(m \cdot isq(\hat{l})) = (m \cdot isq(\hat{l}))(1 + \delta_4)
$$

By lemma 3, we can write:

$$
isq(\hat{l}) = \dfrac{1}{\sqrt{l}}(1 + \delta_{isql}) \text{ for some }
\delta_{isql} \in \mathbb{R} \text{ such that } 
|\delta_{isql}| \leq \epsilon_{isql}
$$

Where

$$
\epsilon_{isql} = max(
    |\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_l}} - 1|,
    |\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_l}} - 1|
)
$$

So

$$
\hat{s} = \dfrac{m}{\sqrt{l}}(1 + \delta_4)(1 + \delta_{isql}) = 
\dfrac{m}{\sqrt{l}}(1 + \delta_4 + \delta_{isql} + \delta_4\delta_{isql})
$$

Let $\delta_s = \delta_4 + \delta_{isql} + \delta_4\delta_{isql}$

Since $\dfrac{m}{\sqrt{l}} = s$, we can write

$$
\hat{s} = s(1 + \delta_s)
$$

By triangle inequality,

$$
|\delta_4 + \delta_{isql} + \delta_4\delta_{isql}| \leq
\epsilon_m + \epsilon_{isql} + \epsilon_m\epsilon_{isql}
$$

So we can define $\epsilon_s = \epsilon_m + \epsilon_{isql} + \epsilon_m\epsilon_{isql}$ and write $|\delta_s| \leq \epsilon_s$

## $\hat{x}_1, \hat{y}_1$

$$
\hat{x}_1 = (x \cdot \hat{s})(1 + \delta_5) = (x \cdot s)(1 + \delta_5)(1 + \delta_s) = x_1(1 + \delta_5 + \delta_s + \delta_5\delta_s)
$$

By triangle inequality,

$$
|\delta_5 + \delta_s + \delta_5\delta_s| \leq 
\epsilon_m + \epsilon_s + \epsilon_m\epsilon_s
$$

We define $\delta_{x_1} = \delta_5 + \delta_s + \delta_5\delta_s$, 
$\epsilon_{x_1} = \epsilon_m + \epsilon_s + \epsilon_m\epsilon_s$ and
write $|\delta_{x_1}| \leq \epsilon_{x_1}$

Similarly for $\hat{y}_1$ we write

$$
\hat{y}_1 = y(1 + \delta_{y_1}) \\
\delta_{y_1} = \delta_6 + \delta_s + \delta_6\delta_s \\
\epsilon_{y_1} = \epsilon_m + \epsilon_s + \epsilon_m\epsilon_s \\
|\delta_{y_1}| \leq \epsilon_{y_1}
$$

## $\hat{l}_1$

$$
\hat{l}_1 = fl(fl(\hat{x}_1 \cdot \hat{x}_1) + fl(\hat{y}_1 \cdot \hat{y}_1)) = 
$$

$$
[(\hat{x}_1 \cdot \hat{x}_1)(1 + \delta_7) + (\hat{y}_1 \cdot \hat{y}_1)(1 + \delta_8)](1 + \delta_9).
$$

$$
(\hat{x}_1 \cdot \hat{x}_1)(1 + \delta_7)(1 + \delta_9) = 
(x_1 \cdot x_1)(1 + \delta_{x_1}^2)(1 + \delta_7)(1 + \delta_9) =
$$

$$
x_1^2(1 + \delta_{x_1} + \delta_{x_1}^2)(1 + \delta_7)(1 + \delta_9) =
$$

$$
x_1^2(1 + \delta_{x_1}+ \delta_{x_1}^2 + \delta_7 + \delta_7\delta_{x_1} + \delta_7\delta_{x_1}^2)(1 + \delta_9) = 
$$

$$
x_1^2(1 + \delta_{x_1}+ \delta_{x_1}^2 + \delta_7 + \delta_7\delta_{x_1} + \delta_7\delta_{x_1}^2 + \delta_9 + \delta_9\delta_{x_1} + \delta_9\delta_{x_1}^2 + \delta_9\delta_7 + \delta_9\delta_7\delta_{x_1} + \delta_9\delta_7\delta_{x_1}^2)
$$

Similarly for $y_1^2$ we can write:

$$
y_1^2(1 + \delta_{y_1}+ \delta_{y_1}^2 + \delta_8 + \delta_8\delta_{y_1} + \delta_8\delta_{y_1}^2 + \delta_9 + \delta_9\delta_{y_1} + \delta_9\delta_{y_1}^2 + \delta_9\delta_8 + \delta_9\delta_8\delta_{y_1} + \delta_9\delta_8\delta_{y_1}^2)
$$

Similarly to $\hat{l}$, the relative error is 

$$
\dfrac{|\hat{l}_1 - l_1|}{|l_1|}
$$

$$
|\hat{l}_1 - l| = \\
x_1^2(\delta_{x_1}+ \delta_{x_1}^2 + \delta_7 + \delta_7\delta_{x_1} + \\
\delta_7\delta_{x_1}^2 + \delta_9 + \delta_9\delta_{x_1} + \delta_9\delta_{x_1}^2 + \\
\delta_9\delta_7 + \delta_9\delta_7\delta_{x_1} + \delta_9\delta_7\delta_{x_1}^2) + \\
y_1^2(\delta_{y_1}+ \delta_{y_1}^2 + \delta_8 + \delta_8\delta_{y_1} + \delta_8\delta_{y_1}^2 + \\
\delta_9 + \delta_9\delta_{y_1} + \delta_9\delta_{y_1}^2 + \delta_9\delta_8 + \\
\delta_9\delta_8\delta_{y_1} + \delta_9\delta_8\delta_{y_1}^2) \leq \\
$$

(by triangle inequality)

$$
x_1^2(\epsilon_{x_1} + \epsilon_{x_1}^2 + \epsilon_m + \epsilon_m\epsilon_{x_1} + \\
\epsilon_m\epsilon_{x_1}^2 + \epsilon_m + \epsilon_m\epsilon_{x_1} + \epsilon_m\epsilon_{x_1}^2 + \\
\epsilon_m^2 + \epsilon_m^2\epsilon_{x_1} + \epsilon_m^2\epsilon_{x_1}^2) + \\
y_1^2(\epsilon_{y_1} + \epsilon_{y_1}^2 + \epsilon_m + \epsilon_m\epsilon_{y_1} + \\
\epsilon_m\epsilon_{y_1}^2 + \epsilon_m + \epsilon_m\epsilon_{y_1} + \\
\epsilon_m\epsilon_{y_1}^2 + \epsilon_m^2 + \epsilon_m^2\epsilon_{y_1} + \\
\epsilon_m^2\epsilon_{y_1}^2)
$$

So we can define 

$$
\epsilon_{l_1} = \epsilon_{x_1} + \epsilon_{x_1}^2 + \epsilon_m + \epsilon_m\epsilon_{x_1} + \\
\epsilon_m\epsilon_{x_1}^2 + \epsilon_m + \epsilon_m\epsilon_{x_1} + \epsilon_m\epsilon_{x_1}^2 + \\
\epsilon_m^2 + \epsilon_m^2\epsilon_{x_1} + \epsilon_m^2\epsilon_{x_1}^2 + \epsilon_{y_1} + \\
\epsilon_{y_1}^2 + \epsilon_m + \epsilon_m\epsilon_{y_1} + \epsilon_m\epsilon_{y_1}^2 + \epsilon_m + \\
\epsilon_m\epsilon_{y_1} + \epsilon_m\epsilon_{y_1}^2 + \epsilon_m^2 + \epsilon_m^2\epsilon_{y_1} + \\
\epsilon_m^2\epsilon_{y_1}^2
$$

And state that

$$
\hat{l}_1 = l(1 + \delta_{l_1}) \text{ for some } 
\delta_{l_1} \in \mathbb{R} \text{ such that }
|\delta_{l_1}| \leq \epsilon_{l_1}
$$

Hold on tight - we are close to the finale

## $\hat{s}_1$

$$
\hat{s}_1 = fl(m \cdot isq(\hat{l}_1))
$$

By lemma 1, we can write

$$
\hat{s}_1 = (m \cdot isq(\hat{l}_1))(1 + \delta_{10})
$$

Similarly to the proof of $\hat{s}$, we use lemma 3 to write

$$
isq(\hat{l}_1) = \dfrac{1}{\sqrt{l_1}}(1 + \delta_{isql_1}) \text{ for some }
\delta_{isql_1} \in \mathbb{R} \text{ such that } 
|\delta_{isql_1}| \leq \epsilon_{isql_1}
$$

Where

$$
\epsilon_{isql_1} = max(
    |\dfrac{1 - \epsilon_{isq}}{\sqrt{1 + \epsilon_{l_1}}} - 1|,
    |\dfrac{1 + \epsilon_{isq}}{\sqrt{1 - \epsilon_{l_1}}} - 1|
)
$$

So

$$
\hat{s}_1 = \dfrac{m}{\sqrt{l_1}}(1 + \delta_{10})(1 + \delta_{isql_1}) = s_1(1 + \delta_{10} + \delta_{isql_1} + \delta_{10}\delta_{isql_1})
$$

Finally, we define $\delta_{s_1} = \delta_{10} + \delta_{isql_1} + \delta_{10}\delta_{isql_1}$, 
and show by triangle inequality that

$$
|\delta_{s_1}| = 
|\delta_{10} + \delta_{isql_1} + \delta_{10}\delta_{isql_1}| \leq \\
\epsilon_m + \epsilon_{isql_1} + \epsilon_m\epsilon_{isql_1} = 
\epsilon_{s_1}
$$

$\epsilon_{s_1}$ is the maximum relative error we have been searching for. Now, using all 
the definitions we made, we can compute its exact value. 

We will use WolframAlpha for computations with high precision, so we won't
have higher error while computing the error itself.. You can find computations
in the file `computations.txt`

Thank you for reading this long proof. Have a nice day, bye!
