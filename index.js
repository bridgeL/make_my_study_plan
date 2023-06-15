let d = localStorage.getItem("all_data");

if (!d) {
    all_data = {
        all_courses: [],
        show_courses: [],
        search_word: "",
        select_code: "",
        select_spec: "",
        all_specs: [],
        study_plan: ["COMP6710", "COMP6250", "", "", "COMP6442", "COMP8260", "", "", "COMP8715", "", "", "", "COMP8715", "", "", ""],
        total_constraint: []
    }
}
else {
    all_data = JSON.parse(d);
}

setInterval(() => {
    localStorage.setItem("all_data", JSON.stringify(all_data));
}, 1000);

const set_study_plan = (el) => {
    if (all_data.select_code) {
        let i = Number(el.getAttribute("name"));
        let j = Number(el.parentElement.getAttribute("name"));
        let d = all_data.all_courses.find(d => d.code == all_data.select_code);
        let s = j % 2 ? 1 : 2;
        let flag = all_data.study_plan[j * 4 + i] == d.code;

        if (!flag && d.term.indexOf(`Sem ${s}`) == -1) {
            if (!confirm("你确定吗？这学期似乎没有这门课")) return;
        }
        if (flag) {
            all_data.study_plan[j * 4 + i] = "";
        }
        else {
            all_data.study_plan[j * 4 + i] = d.code;
        }
        show_study_plan();
        check_study_plan();
    }
}

const check_study_plan = () => {
    let el = document.body.querySelector(`#constraint`);
    let innerHTML = "";
    if (all_data.select_spec) {
        let d = all_data.all_specs.find(d => d.code == all_data.select_spec);
        for (let dd of d.constraint) {
            let num = all_data.study_plan.filter(d => dd.range.indexOf(d) >= 0).length;
            if (dd.type == "max") {
                if (num > dd.num) innerHTML += `<div>[SPEC WARNING] maximum ${dd.num} of ${dd.range.join(" / ")}</div>`
            }
            else {
                if (num < dd.num) innerHTML += `<div>[SPEC WARNING] minimum ${dd.num} of ${dd.range.join(" / ")}</div>`
            }
        }
    }

    for (let dd of all_data.total_constraint) {
        let num = all_data.study_plan.filter(d => dd.range.indexOf(d) >= 0).length;
        if (dd.type == "max") {
            if (num > dd.num) innerHTML += `<div>[PROG WARNING] maximum ${dd.num} of ${dd.range.join(" / ")}</div>`
        }
        else {
            if (num < dd.num) innerHTML += `<div>[PROG WARNING] minimum ${dd.num} of ${dd.range.join(" / ")}</div>`
        }
    }

    el.innerHTML = innerHTML;
}

const show_study_plan = () => {
    for (let i = 0; i < 4; i++) {
        let d = document.body.querySelector(`.study-plan-sem[name="${i}"]`);
        for (let j = 0; j < 4; j++) {
            let dd = d.querySelector(`[name="${j}"]`);
            let ddd = all_data.all_courses.find(d => d.code == all_data.study_plan[i * 4 + j]);
            if (ddd) {
                dd.innerHTML = `<div>${ddd.code}</div><div>${ddd.name}</div>`;
                dd.style = `background-color:${ddd.color}`;
            }
            else {
                dd.innerHTML = "";
                dd.style = "";
            }
        }
    }
}

const show_spec_info = () => {
    let d = all_data.all_specs.find(d => d.code == all_data.select_spec);
    let element = document.body.querySelector("#course-info");
    let innerHTML = "";
    for (let k of Object.keys(d)) {
        let v = d[k];
        if (k == "code") {
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name"><a href="https://programsandcourses.anu.edu.au/specialisation/${v}-SPEC" target="_blank">${v}</a></div>
            </div>`
        }
        else if (k == "constraint") {
            let s = ""
            for (let vv of v) {
                s += "<div>"
                if (vv.type == "max") s += "maximum "
                else s += "minimum  "
                s += `select ${vv.num} of `
                s += vv.range.join(" / ")
                s += "</div>"
            }
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${s}">${s}</div>
            </div>`
        }
        else if (k == "courses") {
            v = v.join(" / ")
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${v}">${v}</div>
            </div>`
        }
        else if (k == "color") {
        }
        else {
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${v}">${v}</div>
            </div>`
        }
    }
    element.innerHTML = innerHTML;
}

const show_course_info = () => {
    let d = all_data.all_courses.find(d => d.code == all_data.select_code);
    let element = document.body.querySelector("#course-info");
    let innerHTML = "";
    for (let k of Object.keys(d)) {
        let v = d[k];
        if (k == "term") {
            let vv = d.terms.join(" / ");
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${vv}">${v}</div>
            </div>`
        }
        else if (k == "terms" || k == "color") {
        }
        else if (k == "code") {
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name"><a href="https://programsandcourses.anu.edu.au/2023/course/${v}" target="_blank">${v}</a></div>
            </div>`
        }
        else if (k == "relative spec") {
            v = v.join(" / ");
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${v}">${v}</div>
            </div>`
        }
        else {
            innerHTML += `<div class="course">
                <div class="course-code">${k}</div>
                <div class="course-name" title="${v}">${v}</div>
            </div>`
        }
    }
    element.innerHTML = innerHTML;
}

const select_course = (el) => {
    all_data.select_code = el.querySelector(".course-code").innerHTML;
    show_course_info();
}

const select_spec = (el) => {
    if (all_data.select_spec == el.innerHTML) all_data.select_spec = "";
    else {
        all_data.select_spec = el.innerHTML;
        show_spec_info();
    }
    show_all_specs();
    filter_courses();
    check_study_plan();
}

const get_course = (code) => {
    return all_data.all_courses.find(d => d.code == code);
}

const export_plan = () => {
    let names = ["2023 s2", "2024 s1", "2024 s2", "2025 s1"];
    let data = all_data.study_plan;
    let text = "";
    for (let i = 0; i < 4; i++) {
        text += `${names[i]},`;
        for (let j = 0; j < 4; j++) {
            let d = get_course(data[i * 4 + j]);
            if (d)
                text += `"${d.code}\n\n${d.name}",`;
            else
                text += ","
        }
        text += "\n";
    }
    let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(text);
    let link = document.createElement("a");
    link.href = uri;
    link.download = "my-study-plan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const get_all_data = () => {
    let p1 = fetch("3.json", {cache: "no-store"})
        .then((res) => res.json())
        .then((data) => {
            data = data.map(d => {
                let v = d.terms;
                let s = "";
                let n1 = v.filter(d => d.indexOf("Sem 1 2023") >= 0).length;
                let n2 = v.filter(d => d.indexOf("Sem 2 2023") >= 0).length;
                if (n1) s += `Sem 1`;
                if (n2) {
                    if (s) s += " / "
                    s += `Sem 2`;
                }
                d.term = s;
                return d;
            })
            all_data.all_courses = data;

            filter_courses();
        })

    let p2 = fetch("4.json", {cache: "no-store"})
        .then((res) => res.json())
        .then((data) => {
            all_data.all_specs = data;
            all_data.all_courses = all_data.all_courses.map(d => {
                d.color = "";
                for (let dd of all_data.all_specs) {
                    if (dd.courses.indexOf(d.code) >= 0) {
                        d.color = dd.color;
                        break;
                    }
                }
                return d;
            })
            show_all_specs();
        })

    let p3 = fetch("5.json", {cache: "no-store"})
        .then((res) => res.json())
        .then((data) => {
            all_data.total_constraint = data;
        })

    Promise.all([p1, p2, p3]).then(() => {
        show_study_plan();
        check_study_plan();
    })
}

const show_all_specs = () => {
    let element = document.body.querySelector("#spec-list");
    let innerHTML = "";
    all_data.all_specs.forEach(d => {
        let v = "";
        if (d.code == all_data.select_spec) v = "dark";
        innerHTML += `<div class="spec ${v}" style="background-color:${d.color}" onclick="select_spec(this)" title="${d.name}">${d.code}</div>`
    })

    element.innerHTML = innerHTML;
}

const filter_courses = () => {
    all_data.show_courses = all_data.all_courses.filter(d => {
        if ((d.code + d.name).toLowerCase().indexOf(all_data.search_word.toLowerCase()) == -1)
            return false;

        if (all_data.select_spec) {
            let dd = all_data.all_specs.find(d => d.code == all_data.select_spec);
            if (dd.courses.indexOf(d.code) == -1) return false;
        }

        return true;
    })

    let element = document.body.querySelector("#course-list");
    let innerHTML = "";

    all_data.show_courses.forEach(d => {
        innerHTML += `<div class="course" onclick="select_course(this)">
            <div class="course-code">${d.code}</div>
            <div class="course-name">${d.name}</div>
        </div>`
    })

    element.innerHTML = innerHTML;

}

const search = () => {
    all_data.search_word = document.body.querySelector("#search input").value;
    filter_courses();
}

get_all_data();